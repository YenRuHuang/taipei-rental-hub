#!/bin/bash

# Taipei Rental Hub - Zeabur Deployment Script

echo "🚀 開始部署台北租屋整合平台到 Zeabur..."

# 設置 Zeabur token
export ZEABUR_TOKEN=sk-3fhsgpa5aoxais4lg33ix5vvetdev

# 檢查 Git 狀態
echo "📋 檢查 Git 狀態..."
git status

# 添加並提交最新更改
echo "📝 提交最新更改..."
git add .
git commit -m "Deploy: Update for Zeabur with API Gateway integration

🎉 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 創建 Zeabur 專案
echo "🔧 創建 Zeabur 專案..."
zeabur project create taipei-rental-hub

# 部署應用
echo "🚀 部署應用..."
zeabur service deploy

echo "✅ 部署完成！"
echo "📝 請記得在 Zeabur 控制台設置以下環境變數："
echo "   - DATABASE_URL (PostgreSQL)"
echo "   - REDIS_URL (Redis)"
echo "   - MURSFOTO_API_GATEWAY_URL (您的 API Gateway URL)"
echo "   - API_GATEWAY_TOKEN (您的 API Gateway Token)"