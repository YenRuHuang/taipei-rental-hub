import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleProperties = [
  {
    sourceId: "001",
    source: "RENTAL591",
    title: "大安區精美套房，近捷運站",
    description: "全新裝潢，家具家電齊全，適合上班族",
    price: 18000,
    deposit: "兩個月",
    district: "大安區",
    address: "台北市大安區復興南路一段",
    nearMRT: "忠孝復興站",
    area: 8.5,
    roomType: "套房",
    floor: "3F",
    totalFloors: "5F",
    hasParking: false,
    hasPet: true,
    hasCooking: true,
    hasElevator: true,
    hasBalcony: false,
    hasWasher: true,
    contactName: "李小姐",
    contactPhone: "0912-345-678",
    url: "https://rent.591.com.tw/home/001",
    images: [
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80", type: "PHOTO", order: 0 },
      { url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80", type: "PHOTO", order: 1 }
    ],
    features: [
      { feature: "近捷運", category: "交通" },
      { feature: "可養寵物", category: "規定" },
      { feature: "可開伙", category: "規定" },
      { feature: "洗衣機", category: "設備" }
    ]
  },
  {
    sourceId: "002",
    source: "RENTAL591",
    title: "信義區豪華一房一廳",
    description: "景觀佳，採光好，管理完善",
    price: 28000,
    deposit: "兩個月",
    district: "信義區",
    address: "台北市信義區基隆路一段",
    nearMRT: "市政府站",
    area: 15.5,
    roomType: "1房1廳",
    floor: "12F",
    totalFloors: "20F",
    hasParking: true,
    hasPet: false,
    hasCooking: true,
    hasElevator: true,
    hasBalcony: true,
    hasWasher: true,
    contactName: "王先生",
    contactPhone: "0987-654-321",
    url: "https://rent.591.com.tw/home/002",
    images: [
      { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80", type: "PHOTO", order: 0 },
      { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", type: "PHOTO", order: 1 }
    ],
    features: [
      { feature: "停車位", category: "設備" },
      { feature: "景觀佳", category: "其他" },
      { feature: "管理嚴謹", category: "其他" }
    ]
  },
  {
    sourceId: "003",
    source: "RAKUYA",
    title: "中山區溫馨套房",
    description: "交通便利，生活機能佳",
    price: 15000,
    deposit: "一個月",
    district: "中山區",
    address: "台北市中山區南京東路二段",
    nearMRT: "南京復興站",
    area: 7.0,
    roomType: "套房",
    floor: "2F",
    totalFloors: "4F",
    hasParking: false,
    hasPet: false,
    hasCooking: false,
    hasElevator: false,
    hasBalcony: false,
    hasWasher: false,
    contactName: "陳小姐",
    contactPhone: "0923-456-789",
    url: "https://www.rakuya.com.tw/home/003",
    images: [
      { url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", type: "PHOTO", order: 0 }
    ],
    features: [
      { feature: "生活機能佳", category: "生活機能" },
      { feature: "交通便利", category: "交通" }
    ]
  },
  {
    sourceId: "004",
    source: "HOUSEFUN",
    title: "松山區現代化套房",
    description: "全新裝潢，設備完善，拎包入住",
    price: 22000,
    deposit: "兩個月",
    district: "松山區",
    address: "台北市松山區八德路四段",
    nearMRT: "松山站",
    area: 10.0,
    roomType: "套房",
    floor: "5F",
    totalFloors: "8F",
    hasParking: false,
    hasPet: true,
    hasCooking: true,
    hasElevator: true,
    hasBalcony: true,
    hasWasher: true,
    contactName: "林先生",
    contactPhone: "0934-567-890",
    url: "https://housefun.com.tw/home/004",
    images: [
      { url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2062&q=80", type: "PHOTO", order: 0 },
      { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2084&q=80", type: "PHOTO", order: 1 }
    ],
    features: [
      { feature: "全新裝潢", category: "其他" },
      { feature: "可養寵物", category: "規定" },
      { feature: "陽台", category: "設備" }
    ]
  }
];

async function main() {
  console.log("開始播種測試資料...");

  // 清除現有資料
  await prisma.propertyFeature.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.priceHistory.deleteMany();
  await prisma.property.deleteMany();

  // 新增測試物件
  for (const propertyData of sampleProperties) {
    const { images, features, ...mainData } = propertyData;

    const property = await prisma.property.create({
      data: {
        ...mainData,
        images: {
          create: images,
        },
        features: {
          create: features,
        },
        priceHistory: {
          create: {
            price: mainData.price,
          },
        },
      },
    });

    console.log(`Created property: ${property.title}`);
  }

  // 新增一些搜尋歷史記錄
  await prisma.searchHistory.createMany({
    data: [
      {
        query: "大安區套房",
        criteria: JSON.stringify({ district: "大安區", roomType: "套房" }),
        resultCount: 5,
      },
      {
        query: "2萬以下可養寵物",
        criteria: JSON.stringify({ maxPrice: 20000, hasPet: true }),
        resultCount: 3,
      },
    ],
  });

  // 新增爬蟲記錄
  await prisma.crawlerLog.create({
    data: {
      source: "RENTAL591",
      status: "COMPLETED",
      totalFound: 25,
      newProperties: 4,
      updatedProperties: 0,
      completedAt: new Date(),
    },
  });

  console.log("✅ 測試資料播種完成！");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });