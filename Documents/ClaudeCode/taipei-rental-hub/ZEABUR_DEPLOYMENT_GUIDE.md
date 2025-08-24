# 🚀 台北租屋整合平台 - Zeabur 部署指南

## ✅ 專案已準備就緒

您的台北租屋整合平台已經完全配置好，準備部署到 Zeabur！

### 🔧 已完成的設置

1. **✅ 數據庫配置** - 已切換到 PostgreSQL 並準備好 migrations
2. **✅ API Gateway 整合** - 已整合您現有的 `mursfoto-api-gateway-main`
3. **✅ 爬蟲系統修復** - 修復了 Stagehand 配置問題
4. **✅ 環境變數準備** - 配置了生產環境設置

## 🚀 部署步驟

### 1. 推送到 GitHub (如果還沒有)

```bash
# 創建新的 GitHub repository
# 然後添加 remote 和推送
git remote add origin https://github.com/your-username/taipei-rental-hub.git
git branch -M main
git push -u origin main
```

### 2. 在 Zeabur 創建專案

1. 前往 [Zeabur Dashboard](https://dash.zeabur.com)
2. 使用您的 token: `sk-3fhsgpa5aoxais4lg33ix5vvetdev`
3. 點擊 "New Project"
4. 選擇從 GitHub 導入
5. 選擇 `taipei-rental-hub` repository

### 3. 添加服務依賴

在 Zeabur 控制台中添加：
- **PostgreSQL** - 選擇 "Add Service" → "Database" → "PostgreSQL"
- **Redis** - 選擇 "Add Service" → "Database" → "Redis"

### 4. 設置環境變數

在 Zeabur 服務的 Environment Variables 中設置：

```env
# 生產環境
NODE_ENV=production
PORT=3000

# 數據庫 (Zeabur 自動提供)
DATABASE_URL=${DATABASE_URL}
REDIS_URL=${REDIS_URL}

# Mursfoto API Gateway 整合
MURSFOTO_API_GATEWAY_URL=https://your-api-gateway-url.zeabur.app
API_GATEWAY_TOKEN=your-api-gateway-token

# 爬蟲設置
CRAWLER_INTERVAL=60
CRAWLER_CONCURRENT_LIMIT=2
```

### 5. 部署設定

Zeabur 會自動檢測到您的 `zeabur.json` 配置：
- **Build Command**: `npm install && npm run db:generate`
- **Start Command**: `npm run start`
- **Port**: 3000
- **健康檢查**: `/health`

## 🔥 功能特色

您的平台包含以下功能：

### 🤖 AI 智能爬蟲
- **Stagehand + Claude** - 智能解析租屋網站
- **多平台支持** - 591, 樂屋網, 好房網
- **自動去重** - 智能識別重複物件
- **錯誤恢復** - 自動重試和錯誤處理

### 🔍 智能搜尋
- **自然語言搜尋** - "大安區2萬以下可養寵物"
- **結構化查詢** - 價格、區域、房型篩選
- **搜尋建議** - AI 驅動的搜尋優化

### 📊 數據分析
- **價格趨勢** - 即時價格變動追蹤
- **市場統計** - 區域分布、平均價格
- **個人化推薦** - 基於搜尋歷史

### 🎨 現代化界面
- **響應式設計** - 支持手機、平板、桌面
- **即時更新** - WebSocket 即時通知
- **用戶體驗** - 直觀的搜尋和瀏覽

## 📡 API 端點

### 核心 API
- `GET /health` - 健康檢查
- `GET /api/properties` - 房源列表 
- `GET /api/properties/stats` - 統計數據
- `POST /api/search/natural` - 自然語言搜尋

### 管理 API
- `GET /api/crawler/status` - 爬蟲狀態
- `POST /api/crawler/trigger` - 手動觸發爬蟲

## 🔄 持續部署

每次推送到 `main` 分支時，Zeabur 會自動：
1. 拉取最新代碼
2. 安裝依賴 
3. 運行數據庫 migrations
4. 重新啟動服務
5. 執行健康檢查

## 🎯 下一步

部署成功後：

1. **測試 API** - 訪問 `/health` 確認服務運行
2. **檢查爬蟲** - 確認數據正在自動抓取
3. **測試搜尋** - 嘗試自然語言搜尋功能
4. **監控日誌** - 在 Zeabur 控制台查看應用日誌

## 🔧 故障排除

### 如果部署失敗：
1. 檢查 Zeabur 日誌
2. 確認環境變數正確設置
3. 驗證數據庫連接

### 如果爬蟲無法運行：
1. 檢查 API Gateway 連接
2. 驗證 Browserbase 設置
3. 查看爬蟲日誌

## 📞 支持

如有問題，請檢查：
1. Zeabur 服務狀態
2. GitHub Actions (如果設置)
3. 應用日誌

---

**🎉 您的台北租屋整合平台已經準備好服務用戶了！**