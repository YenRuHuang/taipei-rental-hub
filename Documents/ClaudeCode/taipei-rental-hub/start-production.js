const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Taipei Rental Hub Production Server...');

// 啟動後端服務器
const backend = spawn('node', ['src/backend/server.js'], {
  stdio: 'inherit',
  env: { ...process.env }
});

// 啟動爬蟲服務
const crawler = spawn('node', ['src/crawler/index.js'], {
  stdio: 'inherit',
  env: { ...process.env }
});

// 處理進程退出
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  backend.kill('SIGTERM');
  crawler.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Shutting down...');
  backend.kill('SIGINT');
  crawler.kill('SIGINT');
  process.exit(0);
});

backend.on('error', (err) => {
  console.error('Backend failed to start:', err);
  process.exit(1);
});

crawler.on('error', (err) => {
  console.error('Crawler failed to start:', err);
  // 爬蟲失敗不影響主服務
});

console.log('✅ Production server started on port', process.env.PORT || 3000);