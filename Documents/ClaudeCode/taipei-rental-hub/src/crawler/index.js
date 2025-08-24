import { Rental591Crawler } from "./Rental591Crawler.js";
import { PrismaClient } from "@prisma/client";
import cron from "node-cron";
import dotenv from "dotenv";
import winston from "winston";

dotenv.config();

const prisma = new PrismaClient();

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
    new winston.transports.File({ filename: "logs/crawler-main.log" }),
  ],
});

class CrawlerManager {
  constructor() {
    this.crawlers = {
      RENTAL591: Rental591Crawler,
      // 未來可加入其他爬蟲
      // RAKUYA: RakuyaCrawler,
      // HOUSEFUN: HousefunCrawler,
    };
  }

  async crawlAll(options = {}) {
    const results = {
      totalFound: 0,
      newProperties: 0,
      updatedProperties: 0,
      errors: [],
    };

    for (const [source, CrawlerClass] of Object.entries(this.crawlers)) {
      try {
        logger.info(`Starting crawl for ${source}`);
        
        // 記錄爬蟲開始
        const crawlerLog = await prisma.crawlerLog.create({
          data: {
            source,
            status: "RUNNING",
          },
        });

        const crawler = new CrawlerClass();
        const properties = await crawler.crawl(options[source] || {});
        
        results.totalFound += properties.length;

        // 儲存或更新物件資料
        for (const property of properties) {
          try {
            await this.saveProperty(property);
            results.newProperties++;
          } catch (error) {
            if (error.code === "P2002") {
              // 重複的物件，嘗試更新
              await this.updateProperty(property);
              results.updatedProperties++;
            } else {
              logger.error(`Failed to save property: ${error.message}`);
              results.errors.push({
                source,
                error: error.message,
              });
            }
          }
        }

        // 更新爬蟲記錄
        await prisma.crawlerLog.update({
          where: { id: crawlerLog.id },
          data: {
            status: "COMPLETED",
            totalFound: properties.length,
            newProperties: results.newProperties,
            updatedProperties: results.updatedProperties,
            completedAt: new Date(),
          },
        });

        logger.info(`${source} crawl completed: ${properties.length} properties found`);

      } catch (error) {
        logger.error(`${source} crawl failed:`, error);
        results.errors.push({
          source,
          error: error.message,
        });

        // 記錄失敗
        await prisma.crawlerLog.create({
          data: {
            source,
            status: "FAILED",
            errorMessage: error.message,
            completedAt: new Date(),
          },
        });
      }
    }

    return results;
  }

  async saveProperty(propertyData) {
    const { images, features, ...mainData } = propertyData;

    // 建立主要物件資料
    const property = await prisma.property.create({
      data: {
        ...mainData,
        images: {
          create: images.map((url, index) => ({
            url,
            order: index,
            type: "PHOTO",
          })),
        },
        features: {
          create: features.map(feature => ({
            feature,
            category: this.categorizeFeature(feature),
          })),
        },
        priceHistory: {
          create: {
            price: mainData.price,
          },
        },
      },
    });

    return property;
  }

  async updateProperty(propertyData) {
    const existingProperty = await prisma.property.findUnique({
      where: {
        source_sourceId: {
          source: propertyData.source,
          sourceId: propertyData.sourceId,
        },
      },
      include: {
        priceHistory: {
          orderBy: { recordedAt: "desc" },
          take: 1,
        },
      },
    });

    if (!existingProperty) return null;

    // 檢查價格是否變動
    const lastPrice = existingProperty.priceHistory[0]?.price;
    if (lastPrice && lastPrice !== propertyData.price) {
      // 記錄價格變動
      await prisma.priceHistory.create({
        data: {
          propertyId: existingProperty.id,
          price: propertyData.price,
        },
      });

      // 發送價格變動通知
      await this.notifyPriceChange(existingProperty, lastPrice, propertyData.price);
    }

    // 更新物件資料
    const { images, features, ...mainData } = propertyData;
    
    const updated = await prisma.property.update({
      where: { id: existingProperty.id },
      data: {
        ...mainData,
        lastSeenAt: new Date(),
      },
    });

    return updated;
  }

  categorizeFeature(feature) {
    if (feature.includes("捷運") || feature.includes("公車") || feature.includes("交通")) {
      return "交通";
    }
    if (feature.includes("電梯") || feature.includes("車位") || feature.includes("陽台")) {
      return "設施";
    }
    if (feature.includes("學校") || feature.includes("市場") || feature.includes("公園")) {
      return "生活機能";
    }
    if (feature.includes("寵物") || feature.includes("開伙") || feature.includes("管理")) {
      return "規定";
    }
    return "其他";
  }

  async notifyPriceChange(property, oldPrice, newPrice) {
    // 查找關注此物件的用戶
    const favorites = await prisma.favorite.findMany({
      where: { propertyId: property.id },
      include: { user: true },
    });

    for (const favorite of favorites) {
      await prisma.notification.create({
        data: {
          userId: favorite.userId,
          type: "PRICE_CHANGE",
          title: "物件價格變動通知",
          content: `您收藏的物件「${property.title}」價格從 $${oldPrice} 變更為 $${newPrice}`,
          data: {
            propertyId: property.id,
            oldPrice,
            newPrice,
          },
        },
      });
    }
  }

  setupScheduledCrawl() {
    const interval = process.env.CRAWLER_INTERVAL || 30; // 預設30分鐘
    
    // 設定定時爬蟲
    cron.schedule(`*/${interval} * * * *`, async () => {
      logger.info("Starting scheduled crawl...");
      
      try {
        const results = await this.crawlAll({
          RENTAL591: {
            region: "1", // 台北市
            maxPages: 3, // 限制頁數避免過度爬取
          },
        });
        
        logger.info("Scheduled crawl completed:", results);
      } catch (error) {
        logger.error("Scheduled crawl failed:", error);
      }
    });

    logger.info(`Crawler scheduled to run every ${interval} minutes`);
  }
}

// 主程式
async function main() {
  const manager = new CrawlerManager();

  // 檢查是否為單次執行或持續執行
  if (process.argv.includes("--once")) {
    // 單次執行
    logger.info("Running single crawl...");
    const results = await manager.crawlAll({
      RENTAL591: {
        region: "1",
        maxPages: 2,
      },
    });
    logger.info("Crawl results:", results);
    await prisma.$disconnect();
    process.exit(0);
  } else {
    // 設定定時爬蟲
    manager.setupScheduledCrawl();
    
    // 立即執行一次
    logger.info("Running initial crawl...");
    await manager.crawlAll({
      RENTAL591: {
        region: "1",
        maxPages: 1,
      },
    });
  }
}

// 錯誤處理
process.on("unhandledRejection", (error) => {
  logger.error("Unhandled rejection:", error);
  prisma.$disconnect();
  process.exit(1);
});

process.on("SIGINT", async () => {
  logger.info("Shutting down crawler...");
  await prisma.$disconnect();
  process.exit(0);
});

// 啟動爬蟲
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    logger.error("Fatal error:", error);
    process.exit(1);
  });
}

export { CrawlerManager };