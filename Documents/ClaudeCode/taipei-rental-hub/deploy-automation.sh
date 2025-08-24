#!/bin/bash

# 🚀 台北租屋整合平台 - 自動化部署腳本
# 此腳本將引導您完成整個部署過程

set -e  # 遇到錯誤時停止

echo "🏠 台北租屋整合平台 - 自動化部署"
echo "=========================================="

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函數: 打印彩色消息
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

# 檢查必要工具
print_info "檢查必要工具..."

if ! command -v git &> /dev/null; then
    print_error "Git 未安裝，請先安裝 Git"
    exit 1
fi

if ! command -v node &> /dev/null; then
    print_error "Node.js 未安裝，請先安裝 Node.js"
    exit 1
fi

print_success "所有必要工具已安裝"

# 檢查項目狀態
print_info "檢查項目狀態..."
if [ ! -f "package.json" ]; then
    print_error "未找到 package.json，請確認在正確的項目目錄中運行此腳本"
    exit 1
fi

if [ ! -f "zeabur.json" ]; then
    print_error "未找到 zeabur.json，項目配置不完整"
    exit 1
fi

print_success "項目配置檢查完成"

# 收集部署信息
echo ""
print_info "請提供以下部署信息:"

read -p "📝 您的 GitHub 用戶名: " GITHUB_USERNAME
if [ -z "$GITHUB_USERNAME" ]; then
    print_error "GitHub 用戶名不能為空"
    exit 1
fi

read -p "🌐 您的 Mursfoto API Gateway URL (如 https://gateway.zeabur.app): " API_GATEWAY_URL
read -s -p "🔑 您的 API Gateway Token: " API_GATEWAY_TOKEN
echo ""

# 確認信息
echo ""
print_info "請確認以下信息:"
echo "GitHub 用戶名: $GITHUB_USERNAME"
echo "API Gateway URL: $API_GATEWAY_URL"
echo "API Gateway Token: [已設置]"
echo ""

read -p "信息正確嗎? (y/N): " CONFIRM
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    print_warning "取消部署"
    exit 0
fi

# 提交最新更改
print_info "提交最新更改..."
git add .
if git diff --staged --quiet; then
    print_info "沒有新的更改需要提交"
else
    git commit -m "deploy: 準備部署到 Zeabur

🚀 自動化部署配置
🔗 整合 Mursfoto API Gateway  
📦 生產環境準備就緒

🎉 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
    print_success "已提交最新更改"
fi

# 設置 GitHub remote
print_info "配置 GitHub remote..."
REPO_URL="https://github.com/${GITHUB_USERNAME}/taipei-rental-hub.git"

if git remote get-url origin &> /dev/null; then
    print_info "GitHub remote 已存在，更新 URL..."
    git remote set-url origin $REPO_URL
else
    print_info "添加 GitHub remote..."
    git remote add origin $REPO_URL
fi

print_success "GitHub remote 配置完成"

# 創建環境變數文件模板
print_info "創建環境變數模板..."
cat > .env.production.template << EOF
# 生產環境配置模板
NODE_ENV=production
PORT=3000

# 數據庫 (Zeabur 自動提供)
DATABASE_URL=\${DATABASE_URL}
REDIS_URL=\${REDIS_URL}

# Mursfoto API Gateway
MURSFOTO_API_GATEWAY_URL=${API_GATEWAY_URL}
API_GATEWAY_TOKEN=${API_GATEWAY_TOKEN}

# 爬蟲設置
CRAWLER_INTERVAL=60
CRAWLER_CONCURRENT_LIMIT=2

# 可選 API Keys
BROWSERBASE_API_KEY=your-browserbase-key
GOOGLE_MAPS_API_KEY=your-maps-key
EOF

print_success "環境變數模板已創建"

# 顯示後續步驟
echo ""
print_info "🎯 接下來的步驟:"
echo ""
print_info "1. 在 GitHub 上創建 repository:"
echo "   - 前往: https://github.com/new"
echo "   - Repository 名稱: taipei-rental-hub"
echo "   - 設為 Public"
echo "   - 不要勾選 'Initialize with README'"
echo "   - 點擊 'Create repository'"
echo ""

print_info "2. 推送代碼到 GitHub:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""

print_info "3. 在 Zeabur 部署:"
echo "   - 前往: https://dash.zeabur.com"
echo "   - 使用 token: sk-3fhsgpa5aoxais4lg33ix5vvetdev"
echo "   - 創建新專案 → 從 GitHub 導入 → 選擇 taipei-rental-hub"
echo ""

print_info "4. 添加服務:"
echo "   - 添加 PostgreSQL 數據庫"
echo "   - 添加 Redis 快取"
echo ""

print_info "5. 設置環境變數 (複製 .env.production.template 中的內容):"
echo ""

print_warning "是否要現在推送代碼到 GitHub? (需要先在 GitHub 上創建 repository)"
read -p "推送到 GitHub? (y/N): " PUSH_NOW

if [[ $PUSH_NOW =~ ^[Yy]$ ]]; then
    print_info "推送代碼到 GitHub..."
    
    if git branch -M main && git push -u origin main; then
        print_success "✅ 代碼已成功推送到 GitHub!"
        print_success "🔗 Repository: https://github.com/${GITHUB_USERNAME}/taipei-rental-hub"
        echo ""
        print_info "現在可以在 Zeabur 中從 GitHub 導入此項目了"
    else
        print_error "推送失敗。請確認:"
        echo "  1. 已在 GitHub 上創建 taipei-rental-hub repository"
        echo "  2. 有正確的 GitHub 訪問權限"
        echo "  3. 網路連接正常"
    fi
else
    print_info "跳過推送，請手動執行:"
    echo "  git branch -M main"
    echo "  git push -u origin main"
fi

echo ""
print_success "🎉 部署準備完成!"
print_info "📚 詳細部署指南請查看: AUTOMATED_DEPLOY.md"

# 打開相關 URLs (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    print_info "正在為您打開相關頁面..."
    open "https://github.com/new" 2>/dev/null || true
    sleep 2
    open "https://dash.zeabur.com" 2>/dev/null || true
fi