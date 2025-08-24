import express from "express";
import { PrismaClient } from "@prisma/client";
// 暫時移除認證，直接允許管理員功能
const requireAdmin = (req, res, next) => {
  // TODO: 後續實作管理員認證
  next();
};
import { CrawlerManager } from "../crawler/index.js";

const router = express.Router();
const prisma = new PrismaClient();
const crawlerManager = new CrawlerManager();

// POST /api/crawler/start - 手動啟動爬蟲（管理員）
router.post("/start", requireAdmin, async (req, res) => {
  try {
    const { sources, options = {} } = req.body;

    // 如果沒有指定來源，使用所有可用的來源
    const crawlOptions = sources ? 
      Object.fromEntries(sources.map(source => [source, options[source] || {}])) :
      {
        RENTAL591: {
          region: "1", // 台北市
          maxPages: options.maxPages || 3,
        }
      };

    // 非阻塞式啟動爬蟲
    crawlerManager.crawlAll(crawlOptions)
      .then(results => {
        console.log("Manual crawl completed:", results);
      })
      .catch(error => {
        console.error("Manual crawl failed:", error);
      });

    res.json({
      message: "Crawler started successfully",
      sources: Object.keys(crawlOptions),
    });
  } catch (error) {
    console.error("Start crawler error:", error);
    res.status(500).json({ error: "Failed to start crawler" });
  }
});

// GET /api/crawler/logs - 取得爬蟲執行記錄
router.get("/logs", requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      source,
      status,
      startDate,
      endDate,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};

    if (source) {
      where.source = source;
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.startedAt = {};
      if (startDate) {
        where.startedAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.startedAt.lte = new Date(endDate);
      }
    }

    const [logs, total] = await Promise.all([
      prisma.crawlerLog.findMany({
        where,
        skip,
        take,
        orderBy: { startedAt: "desc" },
      }),
      prisma.crawlerLog.count({ where }),
    ]);

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get crawler logs error:", error);
    res.status(500).json({ error: "Failed to fetch crawler logs" });
  }
});

// GET /api/crawler/stats - 取得爬蟲統計資訊
router.get("/stats", requireAdmin, async (req, res) => {
  try {
    const [
      totalRuns,
      successfulRuns,
      failedRuns,
      runningRuns,
      recentStats,
      sourceStats,
    ] = await Promise.all([
      // 總執行次數
      prisma.crawlerLog.count(),
      
      // 成功執行次數
      prisma.crawlerLog.count({
        where: { status: "COMPLETED" }
      }),
      
      // 失敗執行次數
      prisma.crawlerLog.count({
        where: { status: "FAILED" }
      }),
      
      // 執行中的任務
      prisma.crawlerLog.count({
        where: { status: "RUNNING" }
      }),
      
      // 最近 7 天的統計
      prisma.crawlerLog.findMany({
        where: {
          startedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        select: {
          startedAt: true,
          status: true,
          totalFound: true,
          newProperties: true,
        },
        orderBy: { startedAt: "desc" },
      }),
      
      // 各來源統計
      prisma.crawlerLog.groupBy({
        by: ["source", "status"],
        _count: { source: true },
        _sum: {
          totalFound: true,
          newProperties: true,
        },
      }),
    ]);

    // 處理最近統計資料
    const dailyStats = {};
    recentStats.forEach(log => {
      const date = log.startedAt.toDateString();
      if (!dailyStats[date]) {
        dailyStats[date] = {
          total: 0,
          successful: 0,
          failed: 0,
          totalFound: 0,
          newProperties: 0,
        };
      }
      dailyStats[date].total++;
      if (log.status === "COMPLETED") dailyStats[date].successful++;
      if (log.status === "FAILED") dailyStats[date].failed++;
      dailyStats[date].totalFound += log.totalFound || 0;
      dailyStats[date].newProperties += log.newProperties || 0;
    });

    res.json({
      summary: {
        totalRuns,
        successfulRuns,
        failedRuns,
        runningRuns,
        successRate: totalRuns > 0 ? (successfulRuns / totalRuns * 100).toFixed(1) : 0,
      },
      dailyStats: Object.entries(dailyStats).map(([date, stats]) => ({
        date,
        ...stats,
      })),
      sourceStats,
    });
  } catch (error) {
    console.error("Get crawler stats error:", error);
    res.status(500).json({ error: "Failed to fetch crawler statistics" });
  }
});

// GET /api/crawler/status - 取得目前爬蟲狀態
router.get("/status", requireAdmin, async (req, res) => {
  try {
    const runningCrawlers = await prisma.crawlerLog.findMany({
      where: { status: "RUNNING" },
      orderBy: { startedAt: "desc" },
    });

    const lastRun = await prisma.crawlerLog.findFirst({
      where: { status: { in: ["COMPLETED", "FAILED"] } },
      orderBy: { completedAt: "desc" },
    });

    res.json({
      isRunning: runningCrawlers.length > 0,
      runningCrawlers,
      lastRun,
    });
  } catch (error) {
    console.error("Get crawler status error:", error);
    res.status(500).json({ error: "Failed to get crawler status" });
  }
});

// DELETE /api/crawler/logs/:id - 刪除爬蟲記錄（管理員）
router.delete("/logs/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const log = await prisma.crawlerLog.delete({
      where: { id },
    });

    res.json({
      message: "Crawler log deleted successfully",
      log,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Crawler log not found" });
    }
    
    console.error("Delete crawler log error:", error);
    res.status(500).json({ error: "Failed to delete crawler log" });
  }
});

// POST /api/crawler/test - 測試爬蟲（管理員）
router.post("/test", requireAdmin, async (req, res) => {
  try {
    const { source = "RENTAL591", maxPages = 1 } = req.body;

    // 測試單一頁面爬取
    const testOptions = {
      [source]: {
        region: "1",
        maxPages: parseInt(maxPages),
      }
    };

    const results = await crawlerManager.crawlAll(testOptions);

    res.json({
      message: "Crawler test completed",
      results,
    });
  } catch (error) {
    console.error("Test crawler error:", error);
    res.status(500).json({ 
      error: "Crawler test failed",
      details: error.message,
    });
  }
});

export default router;