// Zeabur 自動化配置腳本
// 在 Zeabur 控制台的瀏覽器中運行此腳本

console.log('🚀 台北租屋整合平台 - Zeabur 自動配置');

// 自動化配置函數
async function setupZeaburServices() {
    console.log('📋 開始配置 Zeabur 服務...');
    
    // 等待頁面加載
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 1. 創建 PostgreSQL 服務
    console.log('🗄️ 配置 PostgreSQL...');
    const addServiceButtons = document.querySelectorAll('[data-testid="add-service"], button');
    const addServiceButton = Array.from(addServiceButtons).find(btn => 
        btn.textContent?.includes('Add Service') || btn.textContent?.includes('添加服務')
    );
    
    if (addServiceButton) {
        addServiceButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 選擇 Database
        const databaseButton = Array.from(document.querySelectorAll('button, [role="button"]')).find(btn => 
            btn.textContent?.includes('Database') || btn.textContent?.includes('資料庫')
        );
        
        if (databaseButton) {
            databaseButton.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 選擇 PostgreSQL
            const postgresButton = Array.from(document.querySelectorAll('button, [role="button"]')).find(btn => 
                btn.textContent?.includes('PostgreSQL')
            );
            
            if (postgresButton) {
                postgresButton.click();
                console.log('✅ PostgreSQL 服務已添加');
            }
        }
    }
    
    // 等待服務創建
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 2. 創建 Redis 服務
    console.log('🔴 配置 Redis...');
    const addServiceButton2 = Array.from(document.querySelectorAll('[data-testid="add-service"], button')).find(btn => 
        btn.textContent?.includes('Add Service') || btn.textContent?.includes('添加服務')
    );
    
    if (addServiceButton2) {
        addServiceButton2.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 選擇 Database
        const databaseButton2 = Array.from(document.querySelectorAll('button, [role="button"]')).find(btn => 
            btn.textContent?.includes('Database') || btn.textContent?.includes('資料庫')
        );
        
        if (databaseButton2) {
            databaseButton2.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 選擇 Redis
            const redisButton = Array.from(document.querySelectorAll('button, [role="button"]')).find(btn => 
                btn.textContent?.includes('Redis')
            );
            
            if (redisButton) {
                redisButton.click();
                console.log('✅ Redis 服務已添加');
            }
        }
    }
    
    console.log('🎉 數據庫服務配置完成！');
    console.log('📝 接下來請設置環境變數...');
}

// 環境變數設置
const envVars = {
    'NODE_ENV': 'production',
    'PORT': '3000',
    'DATABASE_URL': '${DATABASE_URL}',
    'REDIS_URL': '${REDIS_URL}',
    'MURSFOTO_API_GATEWAY_URL': 'https://mursfoto-api-gateway.zeabur.app',
    'API_GATEWAY_TOKEN': 'mf_admin_2024',
    'CRAWLER_INTERVAL': '60',
    'CRAWLER_CONCURRENT_LIMIT': '2'
};

console.log('📋 需要設置的環境變數：');
console.table(envVars);

// 複製環境變數到剪貼板
const envString = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

if (navigator.clipboard) {
    navigator.clipboard.writeText(envString).then(() => {
        console.log('📋 環境變數已複製到剪貼板！');
    });
}

// 自動執行設置
setTimeout(setupZeaburServices, 1000);

// 使用說明
console.log(`
🔧 使用方式：
1. 在 Zeabur 控制台打開開發者工具 (F12)
2. 切換到 Console 標籤
3. 複製貼上這個腳本並執行
4. 腳本會自動添加 PostgreSQL 和 Redis
5. 手動設置環境變數（已複製到剪貼板）

🌐 或者手動操作：
1. 點擊 "Add Service" → "Database" → "PostgreSQL"
2. 點擊 "Add Service" → "Database" → "Redis"  
3. 在環境變數中添加上面列出的變數
`);