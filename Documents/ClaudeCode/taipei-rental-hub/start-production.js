import('./src/backend/server.js').then(() => {
  console.log('🚀 Taipei Rental Hub Production Server started successfully');
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});