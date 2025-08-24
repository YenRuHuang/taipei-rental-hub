import { BaseCrawler } from "./BaseCrawler.js";

export class Rental591Crawler extends BaseCrawler {
  constructor() {
    super("RENTAL591");
    this.baseUrl = "https://rent.591.com.tw";
  }

  async crawl(options = {}) {
    const {
      region = "1", // 1 = 台北市
      section = "", // 區域代碼
      kind = "0", // 0 = 不限
      rentprice = "", // 價格範圍
      area = "", // 坪數範圍
      maxPages = 5,
    } = options;

    try {
      await this.init();
      
      const allProperties = [];
      let currentPage = 1;

      while (currentPage <= maxPages) {
        this.logger.info(`Crawling 591 page ${currentPage}...`);
        
        // 構建搜尋 URL
        const searchUrl = this.buildSearchUrl({
          region,
          section,
          kind,
          rentprice,
          area,
          firstRow: (currentPage - 1) * 30,
        });

        await this.navigateToPage(searchUrl);
        await this.waitForElement(".listInfo", 5000);
        await this.scrollToBottom();

        // 使用 AI 提取物件資料
        const properties = await this.extractPropertyData(`
          從這個租屋列表頁面提取所有物件資訊。
          每個物件應包含：
          - title: 物件標題
          - price: 月租金（只要數字）
          - deposit: 押金說明
          - district: 區域（如：大安區、信義區）
          - address: 詳細地址
          - nearMRT: 最近的捷運站
          - area: 坪數（只要數字）
          - roomType: 房型（套房、1房1廳等）
          - floor: 樓層
          - totalFloors: 總樓層數
          - features: 特色標籤陣列（如：近捷運、可養寵物等）
          - images: 圖片URL陣列
          - contactName: 聯絡人姓名
          - contactPhone: 聯絡電話
          - url: 物件詳情頁連結
          - sourceId: 591平台的物件ID
          
          請確保提取頁面上所有可見的租屋物件。
        `);

        if (properties.length === 0) {
          this.logger.info("No more properties found, stopping crawl");
          break;
        }

        // 標準化資料
        const normalizedProperties = this.normalizePropertyData(properties);
        allProperties.push(...normalizedProperties);
        
        this.logger.info(`Found ${properties.length} properties on page ${currentPage}`);

        // 檢查是否有下一頁
        const hasNextPage = await this.checkNextPage();
        if (!hasNextPage) {
          this.logger.info("No more pages available");
          break;
        }

        currentPage++;
        
        // 避免過快請求
        await this.stagehand.page.waitForTimeout(3000);
      }

      this.logger.info(`Total properties crawled from 591: ${allProperties.length}`);
      return allProperties;

    } catch (error) {
      this.logger.error("591 crawler failed:", error);
      throw error;
    } finally {
      await this.close();
    }
  }

  buildSearchUrl(params) {
    const queryParams = new URLSearchParams();
    
    if (params.region) queryParams.append("region", params.region);
    if (params.section) queryParams.append("section", params.section);
    if (params.kind) queryParams.append("kind", params.kind);
    if (params.rentprice) queryParams.append("rentprice", params.rentprice);
    if (params.area) queryParams.append("area", params.area);
    if (params.firstRow) queryParams.append("firstRow", params.firstRow);
    
    queryParams.append("order", "posttime");
    queryParams.append("orderType", "desc");

    return `${this.baseUrl}/?${queryParams.toString()}`;
  }

  async checkNextPage() {
    try {
      // 使用 AI 檢查是否有下一頁按鈕
      const result = await this.stagehand.page.observe({
        instructions: "檢查頁面上是否有「下一頁」按鈕或分頁導航，並且下一頁是可點擊的（不是disabled狀態）"
      });
      
      return result && result.includes("下一頁");
    } catch {
      return false;
    }
  }

  normalizePropertyData(rawData) {
    return rawData.map(item => {
      // 解析區域資訊
      let district = item.district || "";
      let nearMRT = item.nearMRT || "";
      
      // 從地址中提取區域（如果沒有明確的區域資訊）
      if (!district && item.address) {
        const districtMatch = item.address.match(/(.*?區)/);
        if (districtMatch) {
          district = districtMatch[1];
        }
      }

      // 解析房型
      let roomType = item.roomType || "";
      if (!roomType && item.title) {
        // 從標題中提取房型資訊
        const roomMatch = item.title.match(/(\d+房|\d+房\d+廳|套房|雅房)/);
        if (roomMatch) {
          roomType = roomMatch[1];
        }
      }

      // 判斷設施
      const features = item.features || [];
      const hasParking = features.some(f => f.includes("車位") || f.includes("停車"));
      const hasPet = features.some(f => f.includes("寵物"));
      const hasCooking = features.some(f => f.includes("開伙") || f.includes("廚房"));
      const hasElevator = features.some(f => f.includes("電梯"));
      const hasBalcony = features.some(f => f.includes("陽台") || f.includes("露台"));
      const hasWasher = features.some(f => f.includes("洗衣機"));

      return {
        source: this.source,
        sourceId: item.sourceId || this.extractIdFromUrl(item.url),
        title: item.title || "",
        description: item.description || "",
        price: this.parsePrice(item.price),
        deposit: item.deposit || "",
        district,
        address: item.address || "",
        nearMRT,
        area: this.parseArea(item.area),
        roomType,
        floor: item.floor || "",
        totalFloors: item.totalFloors || "",
        hasParking,
        hasPet,
        hasCooking,
        hasElevator,
        hasBalcony,
        hasWasher,
        contactName: item.contactName || "",
        contactPhone: item.contactPhone || "",
        url: this.ensureFullUrl(item.url),
        images: (item.images || []).map(img => this.ensureFullUrl(img)),
        features,
      };
    });
  }

  extractIdFromUrl(url) {
    if (!url) return "";
    const match = url.match(/(\d+)\.html/);
    return match ? match[1] : "";
  }

  ensureFullUrl(url) {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("//")) return `https:${url}`;
    if (url.startsWith("/")) return `${this.baseUrl}${url}`;
    return url;
  }
}