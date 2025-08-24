# 🔧 Zeabur 服務配置指南

## 🎯 快速配置 PostgreSQL 和 Redis

### 方法一：自動化腳本（推薦）

1. **在 Zeabur 控制台** 按 F12 打開開發者工具
2. **切換到 Console 標籤**
3. **複製貼上** `zeabur-setup.js` 中的腳本並執行
4. **腳本會自動添加** PostgreSQL 和 Redis 服務

### 方法二：手動操作

#### 🗄️ 添加 PostgreSQL

1. 點擊 **"Add Service"**
2. 選擇 **"Database"**
3. 選擇 **"PostgreSQL"**
4. 選擇方案（建議 Hobby 或 Pro）
5. 等待部署完成

#### 🔴 添加 Redis

1. 再次點擊 **"Add Service"**
2. 選擇 **"Database"**
3. 選擇 **"Redis"**
4. 選擇方案（建議 Hobby）
5. 等待部署完成

## ⚙️ 環境變數配置

在您的 **taipei-rental-hub** 服務中設置以下環境變數：

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=${DATABASE_URL}
REDIS_URL=${REDIS_URL}
MURSFOTO_API_GATEWAY_URL=https://mursfoto-api-gateway.zeabur.app
API_GATEWAY_TOKEN=mf_admin_2024
CRAWLER_INTERVAL=60
CRAWLER_CONCURRENT_LIMIT=2
```

### 📋 環境變數說明

- `DATABASE_URL` - Zeabur 自動提供的 PostgreSQL 連接字符串
- `REDIS_URL` - Zeabur 自動提供的 Redis 連接字符串
- `MURSFOTO_API_GATEWAY_URL` - 您現有的 API Gateway URL
- `API_GATEWAY_TOKEN` - API Gateway 的認證 token

## 🚀 部署順序

1. **PostgreSQL** → 等待 ✅ Running
2. **Redis** → 等待 ✅ Running  
3. **台北租屋平台** → 設置環境變數 → 部署

## 🔍 驗證部署

部署完成後，檢查以下端點：

1. **健康檢查**: `https://your-app.zeabur.app/health`
2. **API 測試**: `https://your-app.zeabur.app/api/properties`
3. **統計數據**: `https://your-app.zeabur.app/api/properties/stats`

## 📊 服務架構

```
台北租屋平台 (Node.js)
    ↓
┌─────────────┬─────────────┐
│ PostgreSQL  │    Redis    │
│ (主數據庫)   │   (快取)    │
└─────────────┴─────────────┘
    ↓
Mursfoto API Gateway
    ↓
Claude AI API
```

## 🛠️ 故障排除

### 如果服務無法啟動：
1. 檢查環境變數是否正確設置
2. 確認 PostgreSQL 和 Redis 已成功部署
3. 查看服務日誌找出錯誤

### 如果數據庫連接失敗：
1. 確認 `DATABASE_URL` 環境變數存在
2. 檢查 PostgreSQL 服務狀態
3. 重新部署應用服務

### 如果 API Gateway 無法連接：
1. 測試 `https://mursfoto-api-gateway.zeabur.app/health`
2. 確認 `API_GATEWAY_TOKEN` 正確
3. 檢查網絡連接

## 🎉 部署完成後

您將擁有一個完整的 AI 驅動租屋平台：

- 🤖 **智能爬蟲** - 自動抓取房源數據
- 🔍 **自然語言搜尋** - AI 理解搜尋需求
- 📊 **實時統計** - 市場分析和趨勢
- 📱 **響應式界面** - 完美的用戶體驗

---

**🚀 現在就去 Zeabur 完成服務配置吧！**