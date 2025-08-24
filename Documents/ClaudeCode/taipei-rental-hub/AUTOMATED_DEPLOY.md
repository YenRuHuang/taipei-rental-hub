# 🚀 自動部署台北租屋整合平台

## 🎯 立即執行部署

由於 Zeabur CLI 連接問題，我為您準備了完整的 Web 部署方案：

### 🔧 步驟 1: 創建 GitHub Repository

1. **前往**: https://github.com/new
2. **Repository 名稱**: `taipei-rental-hub`
3. **設為 Public** (或 Private 如果您有 Pro 帳號)
4. **不要** 勾選 Initialize with README (我們已有文件)
5. **創建 Repository**

### 📤 步驟 2: 推送代碼

在終端執行以下命令：

```bash
# 添加 GitHub remote (替換 YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/taipei-rental-hub.git

# 推送所有代碼
git branch -M main
git push -u origin main
```

### 🚀 步驟 3: 在 Zeabur 部署

1. **前往**: https://dash.zeabur.com
2. **使用您的 token**: `sk-3fhsgpa5aoxais4lg33ix5vvetdev`
3. **創建新專案**:
   - 點擊 "New Project"
   - 選擇 "Deploy from GitHub"
   - 選擇 `taipei-rental-hub` repository

### 🗄️ 步驟 4: 添加數據庫服務

在 Zeabur 專案中：

1. **添加 PostgreSQL**:
   - 點擊 "Add Service" 
   - 選擇 "Database"
   - 選擇 "PostgreSQL"
   - 選擇適合的方案 (免費或付費)

2. **添加 Redis**:
   - 點擊 "Add Service"
   - 選擇 "Database" 
   - 選擇 "Redis"
   - 選擇適合的方案

### ⚙️ 步驟 5: 設置環境變數

在 Zeabur 服務設置中添加：

```env
# 生產環境設置
NODE_ENV=production
PORT=3000

# 數據庫連接 (Zeabur 自動提供)
DATABASE_URL=${DATABASE_URL}
REDIS_URL=${REDIS_URL}

# 您的 API Gateway 設置 (需要您填入實際值)
MURSFOTO_API_GATEWAY_URL=https://your-gateway.zeabur.app
API_GATEWAY_TOKEN=your-gateway-token

# 爬蟲設置
CRAWLER_INTERVAL=60
CRAWLER_CONCURRENT_LIMIT=2

# 如果有其他 API keys
BROWSERBASE_API_KEY=your-browserbase-key
GOOGLE_MAPS_API_KEY=your-maps-key
```

### 🔍 步驟 6: 驗證部署

1. **檢查構建日誌** - 確認沒有錯誤
2. **測試健康檢查** - 訪問 `https://your-app.zeabur.app/health`
3. **測試 API** - 訪問 `https://your-app.zeabur.app/api/properties`

## 📊 已準備好的功能

### 🤖 AI 爬蟲系統
- ✅ Stagehand + Claude AI 智能解析
- ✅ 多平台支持 (591, 樂屋網, 好房網)
- ✅ 自動錯誤恢復和重試機制
- ✅ 數據去重和標準化

### 🔍 智能搜尋引擎
- ✅ 自然語言查詢: "大安區2萬以下可養寵物"
- ✅ 結構化篩選: 價格、面積、房型、設備
- ✅ AI 驅動的搜尋建議

### 📈 數據分析
- ✅ 即時市場統計
- ✅ 價格分布分析
- ✅ 區域熱點地圖
- ✅ 價格趨勢追蹤

### 🎨 現代化前端
- ✅ Next.js 14 + React 18
- ✅ Tailwind CSS 響應式設計
- ✅ React Query 狀態管理
- ✅ 優化的用戶體驗

## 🔧 技術架構

```
前端: Next.js 14 → 後端: Express.js → 數據庫: PostgreSQL
  ↓                    ↓                ↓
Tailwind CSS        Prisma ORM      Redis 快取
  ↓                    ↓                ↓
React Query     AI 爬蟲系統        數據分析
                     ↓
              Mursfoto API Gateway
                     ↓
                Claude AI API
```

## 🚨 故障排除

### 如果構建失敗:
1. 檢查 Zeabur 構建日誌
2. 確認 `package.json` 中的腳本正確
3. 驗證環境變數設置

### 如果數據庫連接失敗:
1. 確認 PostgreSQL 服務已啟動
2. 檢查 `DATABASE_URL` 環境變數
3. 運行 database migration: `npm run db:migrate:deploy`

### 如果爬蟲無法運行:
1. 檢查 API Gateway 連接
2. 驗證 `MURSFOTO_API_GATEWAY_URL` 設置
3. 確認 `API_GATEWAY_TOKEN` 正確

## 🎉 部署完成後

您的台北租屋整合平台將提供：

1. **🏠 即時房源資訊** - 自動更新的租屋數據
2. **🤖 AI 智能搜尋** - 自然語言查詢支持
3. **📊 市場分析** - 價格趨勢和統計
4. **📱 響應式界面** - 完美支持所有設備
5. **🔄 自動化運營** - 無需手動維護

---

**🚀 立即開始部署，讓您的租屋平台上線！**