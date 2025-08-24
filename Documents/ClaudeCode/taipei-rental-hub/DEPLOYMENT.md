# 台北租屋整合平台 - Zeabur 部署指南

## 🚀 快速部署

### 1. 準備 API Keys

在 Zeabur 控制台的環境變數中設置以下 keys：

```env
# 必需的 API Keys
ANTHROPIC_API_KEY=your-anthropic-api-key-here
BROWSERBASE_API_KEY=your-browserbase-api-key-here

# 可選的 API Keys  
GOOGLE_MAPS_API_KEY=your-google-maps-key-here

# 資料庫和 Redis (Zeabur 自動提供)
DATABASE_URL=${DATABASE_URL}
REDIS_URL=${REDIS_URL}

# 系統設置
NODE_ENV=production
PORT=3000
CRAWLER_INTERVAL=60
CRAWLER_CONCURRENT_LIMIT=2
```

### 2. 服務依賴

該專案需要以下 Zeabur 服務：
- **PostgreSQL** (資料庫)
- **Redis** (快取)

### 3. 部署命令

```bash
# 安裝依賴並部署
npm install
npm run db:generate
npm run db:migrate:deploy
npm run start
```

### 4. 健康檢查

部署後可以透過以下端點檢查服務狀態：
- `GET /health` - 系統健康檢查
- `GET /api/properties` - 房源 API 測試
- `GET /api/properties/stats` - 統計數據測試

## 🔑 API Keys 取得方式

### Anthropic API Key
1. 前往 https://console.anthropic.com/
2. 註冊並建立 API key
3. 用於 AI 自然語言搜尋功能

### Browserbase API Key  
1. 前往 https://browserbase.com/
2. 註冊並建立 API key
3. 用於 Stagehand 智能爬蟲系統

### Google Maps API Key (可選)
1. 前往 https://console.cloud.google.com/
2. 啟用 Maps JavaScript API
3. 建立 API key
4. 用於地理位置和地圖功能

## 📊 功能特色

- ✅ AI 智能房源爬蟲 (591, 樂屋網, 好房網)
- ✅ 自然語言搜尋
- ✅ 即時價格追蹤
- ✅ 智能推薦系統
- ✅ 響應式 Web 界面
- ✅ RESTful API 服務

## 🛠️ 技術架構

- **後端**: Node.js + Express + Prisma ORM
- **前端**: Next.js 14 + Tailwind CSS
- **資料庫**: PostgreSQL
- **快取**: Redis
- **AI**: Anthropic Claude + Stagehand
- **部署**: Zeabur Platform