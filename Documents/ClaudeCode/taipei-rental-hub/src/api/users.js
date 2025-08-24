import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/users/profile - 取得使用者完整檔案
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    // 取得統計資訊
    const [
      favoritesCount,
      searchAlertsCount,
      unreadNotificationsCount,
      searchHistoryCount,
    ] = await Promise.all([
      prisma.favorite.count({ where: { userId } }),
      prisma.searchAlert.count({ where: { userId, isActive: true } }),
      prisma.notification.count({ where: { userId, isRead: false } }),
      prisma.searchHistory.count({ where: { userId } }),
    ]);

    res.json({
      profile,
      stats: {
        favoritesCount,
        searchAlertsCount,
        unreadNotificationsCount,
        searchHistoryCount,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// GET /api/users/dashboard - 使用者儀表板資料
router.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      recentFavorites,
      activeAlerts,
      recentSearches,
      recentNotifications,
    ] = await Promise.all([
      // 最近收藏
      prisma.favorite.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              price: true,
              district: true,
              images: {
                take: 1,
                orderBy: { order: "asc" },
              },
            },
          },
        },
      }),

      // 活躍的搜尋提醒
      prisma.searchAlert.findMany({
        where: { userId, isActive: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),

      // 最近搜尋
      prisma.searchHistory.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),

      // 最近通知
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    res.json({
      recentFavorites,
      activeAlerts,
      recentSearches,
      recentNotifications,
    });
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

// DELETE /api/users/account - 刪除帳號
router.delete("/account", authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // 驗證密碼
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // 軟刪除：設為非活躍
    await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        email: `deleted_${userId}_${Date.now()}@deleted.com`,
      },
    });

    res.json({ message: "Account deactivated successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ error: "Failed to delete account" });
  }
});

// 管理員專用路由

// GET /api/users/admin/list - 取得所有使用者（管理員）
router.get("/admin/list", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      role, 
      isActive 
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          isActive: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              favorites: true,
              searchAlerts: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get users list error:", error);
    res.status(500).json({ error: "Failed to fetch users list" });
  }
});

// PUT /api/users/admin/:id - 更新使用者資料（管理員）
router.put("/admin/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // 不允許更新密碼和某些敏感欄位
    const allowedFields = ["name", "phone", "role", "isActive", "emailVerified"];
    const filteredData = Object.keys(updateData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    const updatedUser = await prisma.user.update({
      where: { id },
      data: filteredData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        emailVerified: true,
        updatedAt: true,
      },
    });

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    
    console.error("Update user error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// GET /api/users/admin/stats - 使用者統計（管理員）
router.get("/admin/stats", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      usersByRole,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.user.groupBy({
        by: ["role"],
        _count: { role: true },
      }),
    ]);

    res.json({
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      usersByRole,
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({ error: "Failed to fetch user statistics" });
  }
});

export default router;