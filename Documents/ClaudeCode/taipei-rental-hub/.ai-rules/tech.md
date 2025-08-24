---
title: Technical Architecture & Standards
description: "Comprehensive technical guide covering architecture, technology stack, and development practices for Taipei Rental Hub"
inclusion: always
---

# Taipei Rental Hub - Technical Architecture & Standards

## 🏗️ System Architecture

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Data Layer    │
│   (Next.js)     │◄──►│   (Express.js)  │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                    ┌─────────────────┐    ┌─────────────────┐
                    │   AI Services   │    │   Cache Layer   │
                    │   (Claude API)  │    │     (Redis)     │
                    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Web Scraper   │
                    │   (Stagehand)   │
                    └─────────────────┘
```

## 🛠️ Technology Stack

### Backend Technologies
- **Runtime**: Node.js 18+ (LTS)
- **Framework**: Express.js 4.18+
- **Language**: JavaScript (ES Modules)
- **ORM**: Prisma 5.7+
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+ (ioredis client)
- **Job Queue**: Bull 4.11+

### AI & Web Scraping
- **AI Platform**: Anthropic Claude API
- **Web Scraping**: @browserbasehq/stagehand (latest)
- **Browser Automation**: Puppeteer 21+
- **HTTP Client**: Axios 1.6+

### Frontend Technologies (Planned)
- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand or React Context
- **Maps**: Google Maps API
- **Charts**: Chart.js or D3.js

### Infrastructure & DevOps
- **Cloud Platform**: Zeabur (primary deployment)
- **Container**: Node.js Docker image
- **CI/CD**: GitHub Actions
- **Monitoring**: Winston logging + health checks
- **Environment**: dotenv configuration

### External Services
- **Authentication**: JWT with bcryptjs
- **Notifications**: LINE Notify API
- **Email**: SMTP (Gmail/SendGrid)
- **Maps**: Google Maps API
- **Browser Hosting**: BrowserBase (for Stagehand)

## 🏛️ Application Architecture

### Core Modules

#### 1. API Layer (`src/api/`)
```javascript
// RESTful API endpoints
├── auth/           # Authentication routes
├── properties/     # Property listing endpoints  
├── search/         # Search and filtering
├── notifications/  # Alert management
├── analytics/      # Market data and trends
└── webhooks/       # External integrations
```

#### 2. Backend Services (`src/backend/`)
```javascript
├── server.js           # Express application entry point
├── middleware/         # Authentication, rate limiting, CORS
├── controllers/        # Business logic handlers
├── services/           # Core business services
└── routes/            # API route definitions
```

#### 3. Data Layer (`src/database/`)
```javascript
├── schema.prisma      # Database schema definition
├── migrations/        # Database migration files
├── seed.js           # Initial data seeding
└── models/           # Prisma client extensions
```

#### 4. Crawler Engine (`src/crawler/`)
```javascript
├── index.js          # Main crawler orchestrator
├── scrapers/         # Platform-specific scrapers
│   ├── 591.js        # 591.com.tw scraper
│   ├── rakuya.js     # Rakuya scraper
│   ├── housefun.js   # HouseFun scraper
│   └── facebook.js   # Facebook groups scraper
├── processors/       # Data processing and normalization
├── scheduler.js      # Cron job management
└── queue.js         # Job queue management
```

#### 5. AI Services (`src/services/`)
```javascript
├── claude.js         # Claude API integration
├── nlp.js           # Natural language processing
├── recommendations.js # Property recommendation engine
├── insights.js      # Market analysis and insights
└── search.js        # AI-powered search logic
```

#### 6. Utilities (`src/utils/`)
```javascript
├── logger.js         # Winston logging configuration
├── validators.js     # Input validation schemas
├── helpers.js        # Common utility functions
├── constants.js      # Application constants
└── config.js        # Configuration management
```

## 🗄️ Database Schema

### Core Entities

#### Properties Table
```sql
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id VARCHAR(255) NOT NULL,
    source_platform VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'TWD',
    property_type VARCHAR(50),
    bedrooms INTEGER,
    bathrooms INTEGER,
    floor INTEGER,
    total_floors INTEGER,
    area_ping DECIMAL(8,2),
    area_sqm DECIMAL(8,2),
    address TEXT,
    district VARCHAR(100),
    neighborhood VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    mrt_stations JSONB,
    amenities JSONB,
    images JSONB,
    contact_info JSONB,
    available_from DATE,
    listing_url TEXT,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    
    CONSTRAINT unique_external_source UNIQUE(external_id, source_platform)
);
```

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    preferences JSONB,
    notification_settings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);
```

#### Saved Searches Table
```sql
CREATE TABLE saved_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    search_criteria JSONB NOT NULL,
    notification_enabled BOOLEAN DEFAULT true,
    last_notified TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 Development Practices

### Code Standards
- **ES Modules**: Use import/export syntax
- **Async/Await**: Prefer over Promise chains
- **Error Handling**: Comprehensive try-catch with proper logging
- **Validation**: Joi or Zod for input validation
- **Security**: Rate limiting, input sanitization, JWT authentication

### Testing Strategy
```javascript
// Test structure
tests/
├── unit/           # Unit tests for individual functions
├── integration/    # API endpoint tests  
├── crawler/        # Scraper functionality tests
├── fixtures/       # Test data and mocks
└── e2e/           # End-to-end user flow tests
```

### Environment Configuration
```bash
# Development
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/taipei_rental_dev
REDIS_URL=redis://localhost:6379

# AI Services
ANTHROPIC_API_KEY=your-claude-api-key
BROWSERBASE_API_KEY=your-browserbase-key

# External APIs
GOOGLE_MAPS_API_KEY=your-google-maps-key
LINE_NOTIFY_TOKEN=your-line-notify-token

# Scraping Configuration
CRAWLER_INTERVAL=30          # minutes between runs
CRAWLER_CONCURRENT_LIMIT=3   # max concurrent scrapers
```

## 🚀 Deployment & Operations

### Zeabur Deployment Configuration
```json
{
  "name": "taipei-rental-hub",
  "framework": "node.js",
  "buildCommand": "npm install && npm run db:generate",
  "startCommand": "npm start",
  "port": 3000,
  "environment": {
    "NODE_ENV": "production"
  }
}
```

### Development Commands
```bash
# Development
npm run dev                 # Start backend + crawler
npm run dev:backend        # Backend only
npm run dev:crawler        # Crawler only  
npm run dev:frontend       # Next.js frontend

# Database
npm run db:migrate         # Run Prisma migrations
npm run db:generate        # Generate Prisma client
npm run db:seed           # Seed initial data

# Testing
npm test                   # Run all tests
npm run test:watch        # Watch mode testing

# Production
npm run build             # Build frontend
npm start                 # Start production server
```

## 🔒 Security Considerations

### Authentication & Authorization
- JWT tokens with 8-hour expiration
- bcryptjs password hashing (10 rounds)
- Role-based access control (RBAC)
- API rate limiting (express-rate-limit)

### Data Security
- Input validation and sanitization
- SQL injection prevention (Prisma ORM)
- XSS protection headers
- CORS configuration
- Environment variable security

### Scraping Ethics
- Respect robots.txt files
- Implement delays between requests
- User-Agent rotation
- IP rotation (via BrowserBase)
- Monitor for rate limiting

## 📊 Performance Optimization

### Caching Strategy
```javascript
// Redis caching layers
├── Search Results (5 minutes TTL)
├── Property Details (15 minutes TTL)  
├── Market Analytics (1 hour TTL)
├── User Preferences (indefinite)
└── API Rate Limits (sliding window)
```

### Database Optimization
- Indexes on frequently queried fields (price, district, property_type)
- Full-text search indexes for property descriptions
- Geospatial indexes for location-based queries
- Connection pooling with Prisma
- Query optimization monitoring

### Monitoring & Logging
```javascript
// Winston logging levels
├── error    # System errors, failed scrapers
├── warn     # Rate limits, validation errors
├── info     # User actions, scraper statistics  
├── debug    # Detailed execution flow
└── verbose  # Request/response logging
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: Deploy to Zeabur
on:
  push:
    branches: [main]
jobs:
  test:
    - Run unit tests
    - Run integration tests
    - Check code coverage
  deploy:
    - Build application
    - Run database migrations
    - Deploy to Zeabur
    - Run health checks
```

## 📱 API Design Principles

### RESTful Conventions
```javascript
// Property endpoints
GET    /api/properties              # List properties with filtering
GET    /api/properties/:id          # Get specific property
POST   /api/properties/search       # Advanced search with AI
GET    /api/properties/analytics    # Market analysis

// User management
POST   /api/auth/login              # User authentication
POST   /api/auth/register           # User registration
GET    /api/users/profile           # User profile
PUT    /api/users/preferences       # Update preferences

// Saved searches
GET    /api/searches                # User's saved searches
POST   /api/searches                # Create saved search
PUT    /api/searches/:id            # Update saved search
DELETE /api/searches/:id            # Delete saved search
```

### Response Format
```javascript
// Success response
{
  "success": true,
  "data": {
    "properties": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0.0"
  }
}

// Error response  
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid search parameters",
    "details": {
      "field": "price_max",
      "issue": "Must be greater than price_min"
    }
  }
}
```