import express from "express";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const router = express.Router();
const prisma = new PrismaClient();

// 通過 Mursfoto API Gateway 解析查詢
async function parseViaAPIGateway(query) {
  try {
    const response = await axios.post(
      `${process.env.MURSFOTO_API_GATEWAY_URL}/api/proxy/claude/messages`,
      {
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `請將以下租屋需求轉換為結構化的搜尋條件。請以JSON格式回應，包含以下欄位：
- district: 區域名稱（如：大安區、信義區等）
- minPrice: 最低價格
- maxPrice: 最高價格  
- minArea: 最低坪數
- maxArea: 最高坪數
- roomType: 房型（套房、1房、2房等）
- nearMRT: 捷運站名稱
- hasParking: 需要停車位（true/false）
- hasPet: 可養寵物（true/false）
- hasCooking: 可開伙（true/false）

用戶查詢: "${query}"

只回應JSON格式，不要其他說明文字。`
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.API_GATEWAY_TOKEN}`
        }
      }
    );

    const aiResponse = response.data.content[0].text;
    const parsed = JSON.parse(aiResponse);
    
    return {
      criteria: parsed,
      explanation: `已解析查詢: ${query}`
    };
    
  } catch (error) {
    console.error("API Gateway parsing error:", error);
    throw new Error("Failed to parse via API Gateway");
  }
}

// AI 自然語言搜尋解析器
async function parseNaturalLanguageQuery(query) {
  // 檢查是否使用 API Gateway
  const useGateway = process.env.MURSFOTO_API_GATEWAY_URL;
  
  if (useGateway) {
    return await parseViaAPIGateway(query);
  }
  
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("Anthropic API key not configured");
  }

  try {
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `請將以下租屋需求轉換為結構化的搜尋條件。請以JSON格式回應，包含以下欄位：
- district: 區域名稱（如：大安區、信義區等）
- minPrice: 最低價格
- maxPrice: 最高價格  
- minArea: 最低坪數
- maxArea: 最高坪數
- roomType: 房型（套房、1房、2房等）
- nearMRT: 捷運站名稱
- hasParking: 是否需要停車位 (boolean)
- hasPet: 是否可養寵物 (boolean) 
- hasCooking: 是否可開伙 (boolean)
- hasElevator: 是否需要電梯 (boolean)
- hasBalcony: 是否需要陽台 (boolean)

用戶查詢: "${query}"

請只回應JSON，不要其他說明文字。如果無法判斷某個條件，請設為null。`
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        }
      }
    );

    const content = response.data.content[0].text;
    
    // 嘗試解析 JSON
    try {
      return JSON.parse(content);
    } catch {
      // 如果直接解析失敗，嘗試提取JSON部分
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("Failed to parse AI response");
    }
    
  } catch (error) {
    console.error("Natural language parsing error:", error);
    throw new Error("Failed to parse natural language query");
  }
}

// POST /api/search/natural - 自然語言搜尋
router.post("/natural", async (req, res) => {
  try {
    const { query, userId } = req.body;
    
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query is required" });
    }

    // 記錄搜尋歷史
    const searchHistory = await prisma.searchHistory.create({
      data: {
        userId: userId || null,
        query,
        criteria: {},
      },
    });

    // 使用 AI 解析自然語言查詢
    const parsedCriteria = await parseNaturalLanguageQuery(query);
    
    // 更新搜尋歷史的解析結果
    await prisma.searchHistory.update({
      where: { id: searchHistory.id },
      data: { criteria: parsedCriteria },
    });

    // 執行搜尋
    const searchResults = await executeSearch(parsedCriteria, req.query);
    
    // 更新結果數量
    await prisma.searchHistory.update({
      where: { id: searchHistory.id },
      data: { resultCount: searchResults.pagination.total },
    });

    res.json({
      query,
      parsedCriteria,
      ...searchResults,
    });

  } catch (error) {
    console.error("Natural search error:", error);
    res.status(500).json({ 
      error: "Natural language search failed",
      details: error.message 
    });
  }
});

// GET /api/search - 結構化搜尋
router.get("/", async (req, res) => {
  try {
    const results = await executeSearch(req.query, req.query);
    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

// 執行搜尋的核心函數
async function executeSearch(criteria, options = {}) {
  const {
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = options;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  // 構建 where 條件
  const where = {
    isActive: true,
  };

  if (criteria.district) {
    where.district = {
      contains: criteria.district,
      mode: "insensitive",
    };
  }

  if (criteria.minPrice || criteria.maxPrice) {
    where.price = {};
    if (criteria.minPrice) where.price.gte = parseInt(criteria.minPrice);
    if (criteria.maxPrice) where.price.lte = parseInt(criteria.maxPrice);
  }

  if (criteria.minArea || criteria.maxArea) {
    where.area = {};
    if (criteria.minArea) where.area.gte = parseFloat(criteria.minArea);
    if (criteria.maxArea) where.area.lte = parseFloat(criteria.maxArea);
  }

  if (criteria.roomType) {
    where.roomType = {
      contains: criteria.roomType,
      mode: "insensitive",
    };
  }

  if (criteria.nearMRT) {
    where.nearMRT = {
      contains: criteria.nearMRT,
      mode: "insensitive",
    };
  }

  if (criteria.hasParking === true) where.hasParking = true;
  if (criteria.hasPet === true) where.hasPet = true;
  if (criteria.hasCooking === true) where.hasCooking = true;
  if (criteria.hasElevator === true) where.hasElevator = true;
  if (criteria.hasBalcony === true) where.hasBalcony = true;

  // 執行查詢
  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        images: {
          take: 1,
          orderBy: { order: "asc" },
        },
        features: true,
        _count: {
          select: {
            favorites: true,
          },
        },
      },
    }),
    prisma.property.count({ where }),
  ]);

  return {
    properties,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
    searchCriteria: criteria,
  };
}

// GET /api/search/suggestions - 搜尋建議
router.get("/suggestions", async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    const suggestions = await Promise.all([
      // 區域建議
      prisma.property.findMany({
        where: {
          district: {
            contains: q,
            mode: "insensitive",
          },
          isActive: true,
        },
        select: { district: true },
        distinct: ["district"],
        take: 5,
      }),
      
      // 捷運站建議
      prisma.property.findMany({
        where: {
          nearMRT: {
            contains: q,
            mode: "insensitive",
          },
          isActive: true,
        },
        select: { nearMRT: true },
        distinct: ["nearMRT"],
        take: 5,
      }),
      
      // 房型建議
      prisma.property.findMany({
        where: {
          roomType: {
            contains: q,
            mode: "insensitive",
          },
          isActive: true,
        },
        select: { roomType: true },
        distinct: ["roomType"],
        take: 5,
      }),
    ]);

    const combined = [
      ...suggestions[0].map(s => ({ type: "district", value: s.district })),
      ...suggestions[1].map(s => ({ type: "mrt", value: s.nearMRT })),
      ...suggestions[2].map(s => ({ type: "roomType", value: s.roomType })),
    ].filter(s => s.value && s.value.trim());

    res.json({ suggestions: combined });
  } catch (error) {
    console.error("Suggestions error:", error);
    res.status(500).json({ error: "Failed to get suggestions" });
  }
});






export default router;