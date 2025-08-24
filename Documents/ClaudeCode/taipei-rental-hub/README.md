# 🏠 台北租屋整合平台 (Taipei Rental Hub)

> **AI 驅動的智能租屋資訊聚合系統**

整合台灣所有主要租屋平台（591、樂屋網、好房網等），提供統一的搜尋介面和 AI 自然語言搜尋功能，讓找房變得簡單智能。

## 📋 專案特色

- 🤖 **AI 智能爬蟲**: 使用 Stagehand + Claude API 自動化爬取租屋資訊
- 🗣️ **自然語言搜尋**: 支援「大安區2萬以下近捷運可養寵物的套房」等自然語言查詢
- 🎯 **個人化推薦**: 基於使用者偏好的智能物件推薦
- 📱 **即時通知**: Line/Email 通知新物件和價格變動
- 🗺️ **地圖整合**: Google Maps 顯示物件位置和通勤時間
- 📊 **價格追蹤**: 歷史價格變動分析和市場趨勢

## 🏗️ 技術架構

### 後端 (Node.js/Express)
- **Web 爬蟲**: Stagehand 驅動的 AI 爬蟲系統
- **API 架構**: RESTful API + JWT 認證
- **資料庫**: PostgreSQL + Prisma ORM
- **快取層**: Redis + Bull Queue
- **AI 服務**: Anthropic Claude API
- **日誌**: Winston 結構化日誌

### 前端 (Next.js/React)
- **框架**: Next.js 14 + React 18
- **開發語言**: TypeScript
- **樣式**: Tailwind CSS + Headless UI
- **狀態管理**: Zustand + React Query
- **地圖**: React Leaflet
- **UI 元件**: 自訂響應式設計

### 資料庫設計
- **物件管理**: 物件資訊、圖片、特色標籤、價格歷史
- **搜尋功能**: 搜尋歷史記錄
- **爬蟲系統**: 執行記錄、來源管理

## 🚀 快速開始

### 環境需求
- Node.js >= 18.0.0
- PostgreSQL >= 13
- Redis >= 6.0
- 可選: Docker & Docker Compose

### 1. 克隆專案
```bash
git clone <repository-url>
cd taipei-rental-hub
```

### 2. 安裝依賴
```bash
# 安裝後端依賴
npm install

# 安裝前端依賴
cd frontend && npm install && cd ..
```

### 3. 環境配置
```bash
# 複製環境變數模板
cp .env.example .env

# 設定必要的環境變數
vim .env
```

**必要環境變數**:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/taipei_rental_hub"
REDIS_URL="redis://localhost:6379"
ANTHROPIC_API_KEY="your-anthropic-api-key"
BROWSERBASE_API_KEY="your-browserbase-api-key"
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

### 4. 資料庫設定
```bash
# 生成 Prisma 客戶端
npm run db:generate

# 執行資料庫遷移
npm run db:migrate

# 選用: 播種測試資料
npm run db:seed
```

### 5. 啟動應用
```bash
# 開發模式（同時啟動後端和爬蟲）
npm run dev

# 在另一個終端啟動前端
npm run dev:frontend

# 或使用 Docker Compose
docker-compose up -d
```

## 📚 API 文檔

### 物件 API
- `GET /api/properties` - 取得物件列表（支援分頁和篩選）
- `GET /api/properties/:id` - 取得單一物件詳情
- `GET /api/properties/stats` - 取得物件統計資訊

### 搜尋 API
- `POST /api/search/natural` - AI 自然語言搜尋
- `GET /api/search` - 結構化搜尋
- `GET /api/search/suggestions` - 搜尋建議

### 管理員 API
- `POST /api/crawler/start` - 手動啟動爬蟲
- `GET /api/crawler/logs` - 爬蟲執行記錄
- `GET /api/crawler/stats` - 爬蟲統計資訊
- `GET /api/crawler/status` - 爬蟲狀態檢查
- `POST /api/crawler/test` - 測試爬蟲功能

## 🔧 開發指南

### 專案結構
```
taipei-rental-hub/
├── src/                    # 後端原始碼
│   ├── api/               # API 路由
│   ├── crawler/           # 爬蟲模組
│   ├── middleware/        # Express 中間件
│   └── services/          # 業務邏輯
├── frontend/              # 前端應用
│   └── src/
│       ├── app/          # Next.js App Router
│       ├── components/   # React 元件
│       └── services/     # API 呼叫
├── prisma/               # 資料庫 Schema
├── .ai-rules/           # AI 開發指導文件
└── docs/                # 專案文檔
```

### 開發工作流
1. **功能開發**: 基於 `.ai-rules/` 指導文件開發
2. **資料庫變更**: 使用 Prisma 管理 Schema 變更
3. **測試**: 執行 `npm test` 進行單元測試
4. **程式碼檢查**: `npm run lint` 和 `npm run type-check`
5. **部署**: 使用 `npm run build` 建置生產版本

### 爬蟲開發
1. 繼承 `BaseCrawler` 類別
2. 實作 `crawl()` 方法
3. 使用 AI 智能解析網頁內容
4. 在 `CrawlerManager` 中註冊新爬蟲

### 前端開發
1. 使用 TypeScript 確保型別安全
2. 遵循 Tailwind CSS 設計系統
3. 實作響應式設計
4. 使用 React Query 管理 API 狀態

## 🚀 部署

### Zeabur 部署（mursfoto-cli 推薦）
```bash
# 安裝 Zeabur CLI
npm install -g zeabur

# 登入 Zeabur
zeabur auth login

# 部署專案（自動使用 zeabur.json 配置）
zeabur deploy

# 設定環境變數
zeabur env set ANTHROPIC_API_KEY=your-api-key
zeabur env set BROWSERBASE_API_KEY=your-browserbase-key
zeabur env set GOOGLE_MAPS_API_KEY=your-maps-key
```

### 本地開發部署
```bash
# 建置專案
npm run build

# 啟動生產服務
NODE_ENV=production npm start
```

### Docker 部署（可選）
```bash
# 建置並啟動所有服務
docker-compose up -d

# 查看服務狀態
docker-compose ps
```

### 其他雲端平台
支援部署到：
- **Railway** 
- **Render** 
- **Fly.io**
- **DigitalOcean App Platform**

## 📊 監控與維護

### 健康檢查
```bash
# API 健康檢查
curl http://localhost:3000/health

# 爬蟲狀態檢查
curl http://localhost:3000/api/crawler/status
```

### 日誌管理
- 應用日誌: `logs/server.log`
- 爬蟲日誌: `logs/crawler.log`
- 錯誤日誌: `logs/error.log`

### 效能監控
- API 響應時間監控
- 資料庫查詢效能分析
- 爬蟲成功率統計
- 記憶體和 CPU 使用率

## 🛠️ 故障排除

### 常見問題

**Q: 爬蟲無法執行**
```bash
# 檢查環境變數
echo $ANTHROPIC_API_KEY
echo $BROWSERBASE_API_KEY

# 手動測試爬蟲
npm run crawler -- --once
```

**Q: 資料庫連線失敗**
```bash
# 檢查資料庫連線
npx prisma db pull

# 重新生成客戶端
npm run db:generate
```

**Q: 前端無法連接 API**
```bash
# 檢查 API 服務狀態
curl http://localhost:3000/health

# 檢查環境變數
echo $NEXT_PUBLIC_API_URL
```

### 除錯模式
```bash
# 啟動除錯模式
DEBUG=* npm run dev

# 查看詳細爬蟲日誌
DEBUG=crawler:* npm run crawler
```

## 🔒 安全考量

### 已實作的安全措施
- JWT 認證與授權
- API 請求限流
- SQL 注入防護（Prisma ORM）
- XSS 防護
- CORS 設定

### 建議的安全增強
- 實作 httpOnly Cookies
- 增強輸入驗證
- API 金鑰管理
- 資料加密
- 審計日誌

## 🤝 貢獻指南

1. Fork 本專案
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 建立 Pull Request

### 開發規範
- 使用 TypeScript 進行開發
- 遵循 ESLint 規則
- 撰寫單元測試
- 更新相關文檔

## 📄 授權

本專案採用 MIT 授權條款 - 查看 [LICENSE](LICENSE) 檔案了解詳情。

## 🙋‍♂️ 支援

如有問題或建議，請：
1. 查看 [常見問題](#故障排除)
2. 搜尋現有 [Issues](../../issues)
3. 建立新的 Issue

## 🔮 未來規劃

- [ ] 支援更多租屋平台（Facebook 社團、PTT）
- [ ] 實作推播通知（PWA）
- [ ] 增加虛擬看房功能
- [ ] 整合房東評價系統
- [ ] 支援房東端管理介面
- [ ] 實作聊天機器人客服

---

**🏠 讓找房變得更簡單、更智能！**