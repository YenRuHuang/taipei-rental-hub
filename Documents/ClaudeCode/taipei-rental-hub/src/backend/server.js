import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import winston from "winston";
import { PrismaClient } from "@prisma/client";

// Import routes
import propertyRoutes from "../api/properties.js";
import searchRoutes from "../api/search.js";
import crawlerRoutes from "../api/crawler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize Prisma with error handling
let prisma;
try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Failed to initialize Prisma:', error);
}

// Logger setup
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
    new winston.transports.File({ filename: "logs/server.log" }),
  ],
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? process.env.FRONTEND_URL 
    : ["http://localhost:3001", "http://localhost:3000"],
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

app.use("/api/", limiter);

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  next();
});

// Basic health check (no database dependency)
app.get("/ping", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString() 
  });
});

// Detailed health check
app.get("/health", async (req, res) => {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database: "disconnected"
  };

  // Test database connection
  if (prisma) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      health.database = "connected";
    } catch (error) {
      health.database = "error: " + error.message;
      health.status = "degraded";
    }
  }

  res.json(health);
});

// API Routes
app.use("/api/properties", propertyRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/crawler", crawlerRoutes);

// Static files for uploaded images
app.use("/uploads", express.static("uploads"));

// Static files for frontend (public folder)
app.use(express.static("public"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource does not exist",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error("Server error:", err);
  
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  if (prisma) {
    await prisma.$disconnect();
  }
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT signal received: closing HTTP server");
  if (prisma) {
    await prisma.$disconnect();
  }
  process.exit(0);
});

// Test database connection
async function testDatabaseConnection() {
  if (prisma) {
    try {
      await prisma.$connect();
      logger.info("✅ Database connection successful");
      return true;
    } catch (error) {
      logger.error("❌ Database connection failed:", error.message);
      return false;
    }
  } else {
    logger.warn("⚠️  Database not initialized");
    return false;
  }
}

// Start server
const server = app.listen(PORT, async () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  logger.info(`🌐 Health check: http://localhost:${PORT}/health`);
  logger.info(`📋 Basic ping: http://localhost:${PORT}/ping`);
  
  // Log environment variables (safely)
  logger.info(`🔗 DATABASE_URL configured: ${process.env.DATABASE_URL ? 'Yes' : 'No'}`);
  logger.info(`🔗 REDIS_URL configured: ${process.env.REDIS_URL ? 'Yes' : 'No'}`);
  logger.info(`🔗 API Gateway configured: ${process.env.MURSFOTO_API_GATEWAY_URL ? 'Yes' : 'No'}`);
  
  // Test database connection
  await testDatabaseConnection();
});

// Handle server errors
server.on('error', (error) => {
  logger.error('Server error:', error);
  process.exit(1);
});

export default app;