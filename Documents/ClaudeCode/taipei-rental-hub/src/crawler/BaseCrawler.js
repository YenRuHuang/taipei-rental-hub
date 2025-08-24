import { Stagehand } from "@browserbasehq/stagehand";
import winston from "winston";
import dotenv from "dotenv";

dotenv.config();

// 設定 logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: "logs/crawler.log" }),
  ],
});

export class BaseCrawler {
  constructor(source) {
    this.source = source;
    this.stagehand = null;
    this.logger = logger;
  }

  async init() {
    try {
      this.stagehand = new Stagehand({
        env: process.env.BROWSERBASE_API_KEY ? "BROWSERBASE" : "LOCAL",
        modelName: "claude-3-5-sonnet-20241022",
        modelClientOptions: {
          apiKey: process.env.ANTHROPIC_API_KEY,
        },
        debugDom: true,
      });

      await this.stagehand.init();
      this.logger.info(`${this.source} crawler initialized`);
      
      if (this.stagehand.browserbaseSessionID) {
        this.logger.info(`Session URL: https://browserbase.com/sessions/${this.stagehand.browserbaseSessionID}`);
      }
    } catch (error) {
      this.logger.error(`Failed to initialize ${this.source} crawler:`, error);
      throw error;
    }
  }

  async navigateToPage(url) {
    try {
      await this.stagehand.page.goto(url, { 
        waitUntil: "networkidle",
        timeout: 30000 
      });
      this.logger.info(`Navigated to ${url}`);
    } catch (error) {
      this.logger.error(`Failed to navigate to ${url}:`, error);
      throw error;
    }
  }

  async extractPropertyData(instructions) {
    try {
      const data = await this.stagehand.page.extract({
        instructions,
        schema: {
          type: "object",
          properties: {
            properties: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  price: { type: "number" },
                  deposit: { type: "string" },
                  district: { type: "string" },
                  address: { type: "string" },
                  nearMRT: { type: "string" },
                  area: { type: "number" },
                  roomType: { type: "string" },
                  floor: { type: "string" },
                  totalFloors: { type: "string" },
                  features: {
                    type: "array",
                    items: { type: "string" }
                  },
                  images: {
                    type: "array",
                    items: { type: "string" }
                  },
                  contactName: { type: "string" },
                  contactPhone: { type: "string" },
                  url: { type: "string" },
                  sourceId: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      return data.properties || [];
    } catch (error) {
      this.logger.error("Failed to extract property data:", error);
      return [];
    }
  }

  async scrollToBottom() {
    try {
      await this.stagehand.page.evaluate(() => {
        return new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });
    } catch (error) {
      this.logger.error("Failed to scroll page:", error);
    }
  }

  async clickElement(selector) {
    try {
      await this.stagehand.page.act({
        instructions: `Click on the element: ${selector}`
      });
      await this.stagehand.page.waitForTimeout(2000);
    } catch (error) {
      this.logger.error(`Failed to click element ${selector}:`, error);
    }
  }

  async waitForElement(selector, timeout = 10000) {
    try {
      await this.stagehand.page.waitForSelector(selector, { timeout });
      return true;
    } catch {
      return false;
    }
  }

  normalizePropertyData(rawData) {
    // 標準化資料格式，子類可覆寫
    return rawData.map(item => ({
      ...item,
      source: this.source,
      price: this.parsePrice(item.price),
      area: this.parseArea(item.area),
      features: this.parseFeatures(item.features),
    }));
  }

  parsePrice(priceStr) {
    if (typeof priceStr === "number") return priceStr;
    if (!priceStr) return 0;
    
    // 移除非數字字符，提取價格
    const match = priceStr.toString().match(/[\d,]+/);
    if (match) {
      return parseInt(match[0].replace(/,/g, ""));
    }
    return 0;
  }

  parseArea(areaStr) {
    if (typeof areaStr === "number") return areaStr;
    if (!areaStr) return null;
    
    // 提取坪數
    const match = areaStr.toString().match(/[\d.]+/);
    if (match) {
      return parseFloat(match[0]);
    }
    return null;
  }

  parseFeatures(features) {
    if (!Array.isArray(features)) return [];
    return features.filter(f => f && f.trim());
  }

  async close() {
    try {
      if (this.stagehand) {
        await this.stagehand.close();
        this.logger.info(`${this.source} crawler closed`);
      }
    } catch (error) {
      this.logger.error(`Failed to close ${this.source} crawler:`, error);
    }
  }

  // 子類必須實作的方法
  async crawl() {
    throw new Error("Crawl method must be implemented by subclass");
  }
}