import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/properties/stats - 取得物件統計資訊
router.get("/stats", async (req, res) => {
  try {
    const [
      totalProperties,
      avgPrice,
      priceDistribution,
      districtStats,
      recentAdditions,
    ] = await Promise.all([
      // 總物件數
      prisma.property.count({
        where: { isActive: true },
      }),
      
      // 平均價格
      prisma.property.aggregate({
        where: { 
          isActive: true,
          price: { gt: 0 },
        },
        _avg: { price: true },
      }),
      
      // 價格分布
      prisma.$queryRaw`
        SELECT 
          CASE 
            WHEN price < 15000 THEN '<15K'
            WHEN price < 25000 THEN '15K-25K'
            WHEN price < 35000 THEN '25K-35K'
            WHEN price < 50000 THEN '35K-50K'
            ELSE '50K+'
          END as range,
          COUNT(*) as count
        FROM "Property" 
        WHERE "isActive" = true AND price > 0
        GROUP BY range
        ORDER BY MIN(price)
      `,
      
      // 區域統計
      prisma.property.groupBy({
        by: ["district"],
        where: { 
          isActive: true,
          district: { not: "" },
        },
        _count: { district: true },
        _avg: { price: true },
        orderBy: { _count: { district: "desc" } },
        take: 10,
      }),
      
      // 最近新增
      prisma.property.count({
        where: {
          isActive: true,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24小時內
          },
        },
      }),
    ]);

    res.json({
      totalProperties,
      avgPrice: Math.round(avgPrice._avg.price || 0),
      priceDistribution: priceDistribution.map(item => ({
        range: item.range,
        count: Number(item.count)
      })),
      districtStats,
      recentAdditions,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// GET /api/properties - 取得物件列表
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      district,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      roomType,
      nearMRT,
      hasParking,
      hasPet,
      hasCooking,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // 構建 where 條件
    const where = {
      isActive: true,
    };

    if (district) {
      where.district = {
        contains: district,
        mode: "insensitive",
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseInt(minPrice);
      if (maxPrice) where.price.lte = parseInt(maxPrice);
    }

    if (minArea || maxArea) {
      where.area = {};
      if (minArea) where.area.gte = parseFloat(minArea);
      if (maxArea) where.area.lte = parseFloat(maxArea);
    }

    if (roomType) {
      where.roomType = {
        contains: roomType,
        mode: "insensitive",
      };
    }

    if (nearMRT) {
      where.nearMRT = {
        contains: nearMRT,
        mode: "insensitive",
      };
    }

    if (hasParking === "true") where.hasParking = true;
    if (hasPet === "true") where.hasPet = true;
    if (hasCooking === "true") where.hasCooking = true;

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
        },
      }),
      prisma.property.count({ where }),
    ]);

    // 更新瀏覽次數
    const propertyIds = properties.map(p => p.id);
    if (propertyIds.length > 0) {
      await prisma.property.updateMany({
        where: {
          id: { in: propertyIds },
        },
        data: {
          viewCount: { increment: 1 },
        },
      });
    }

    res.json({
      properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
      filters: {
        district,
        minPrice,
        maxPrice,
        minArea,
        maxArea,
        roomType,
        nearMRT,
        hasParking: hasParking === "true",
        hasPet: hasPet === "true",
        hasCooking: hasCooking === "true",
      },
    });
  } catch (error) {
    console.error("Get properties error:", error);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

// GET /api/properties/:id - 取得單一物件詳情
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        features: true,
        priceHistory: {
          orderBy: { recordedAt: "desc" },
          take: 10,
        },
      },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    // 更新瀏覽次數
    await prisma.property.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
      },
    });

    res.json(property);
  } catch (error) {
    console.error("Get property error:", error);
    res.status(500).json({ error: "Failed to fetch property details" });
  }
});

export default router;