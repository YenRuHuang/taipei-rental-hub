---
title: Project Structure & Organization
description: "Detailed project structure, file organization, and development workflow for Taipei Rental Hub"
inclusion: always
---

# Taipei Rental Hub - Project Structure & Organization

## 📁 Project Directory Structure

### Root Level Organization
```
taipei-rental-hub/
├── .ai-rules/                 # AI agent steering files
│   ├── product.md            # Product vision and strategy
│   ├── tech.md               # Technical architecture
│   └── structure.md          # This file - project structure
├── .github/                   # GitHub workflows and templates
│   ├── workflows/
│   │   ├── ci.yml            # Continuous integration
│   │   ├── deploy.yml        # Deployment pipeline
│   │   └── codeql.yml        # Security analysis
│   ├── ISSUE_TEMPLATE/       # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/                      # Project documentation
│   ├── api/                  # API documentation
│   ├── deployment/           # Deployment guides
│   ├── development/          # Developer guides
│   └── user/                 # User documentation
├── src/                      # Main source code
│   ├── api/                  # API route handlers
│   ├── backend/              # Backend services and middleware
│   ├── crawler/              # Web scraping engines
│   ├── database/             # Database schema and migrations
│   ├── services/             # Business logic services
│   ├── utils/                # Shared utilities
│   └── config/               # Configuration management
├── frontend/                 # Next.js frontend application
│   ├── components/           # Reusable React components
│   ├── pages/                # Next.js pages
│   ├── hooks/                # Custom React hooks
│   ├── services/             # Frontend API services
│   ├── styles/               # Styling and themes
│   ├── public/               # Static assets
│   └── types/                # TypeScript type definitions
├── tests/                    # Test suites
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   ├── e2e/                  # End-to-end tests
│   ├── fixtures/             # Test data and mocks
│   └── utils/                # Test utilities
├── scripts/                  # Build and deployment scripts
│   ├── setup.sh              # Development environment setup
│   ├── deploy.sh             # Deployment script
│   └── backup.sh             # Database backup script
├── prisma/                   # Prisma database toolkit
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Database migrations
│   └── seed.ts               # Database seeding
├── .env.example              # Environment configuration template
├── .gitignore               # Git ignore rules
├── package.json             # Node.js dependencies
├── zeabur.json              # Zeabur deployment configuration
└── README.md                # Project overview and setup
```

## 🏗️ Source Code Organization

### API Layer Structure (`src/api/`)
```
src/api/
├── index.js                  # API router and middleware setup
├── auth/                     # Authentication endpoints
│   ├── login.js             # POST /api/auth/login
│   ├── register.js          # POST /api/auth/register
│   ├── refresh.js           # POST /api/auth/refresh
│   └── middleware.js        # JWT authentication middleware
├── properties/               # Property-related endpoints
│   ├── list.js              # GET /api/properties
│   ├── details.js           # GET /api/properties/:id
│   ├── search.js            # POST /api/properties/search
│   ├── analytics.js         # GET /api/properties/analytics
│   └── favorites.js         # User favorites management
├── users/                    # User management endpoints
│   ├── profile.js           # GET/PUT /api/users/profile
│   ├── preferences.js       # GET/PUT /api/users/preferences
│   └── notifications.js     # Notification settings
├── searches/                 # Saved searches management
│   ├── create.js            # POST /api/searches
│   ├── list.js              # GET /api/searches
│   ├── update.js            # PUT /api/searches/:id
│   └── delete.js            # DELETE /api/searches/:id
└── webhooks/                 # External service integrations
    ├── line-notify.js       # LINE Notify webhook
    └── property-updates.js   # Property update notifications
```

### Backend Services (`src/backend/`)
```
src/backend/
├── server.js                 # Express application entry point
├── app.js                   # Express app configuration
├── middleware/               # Express middleware
│   ├── auth.js              # JWT authentication
│   ├── cors.js              # CORS configuration
│   ├── rateLimit.js         # API rate limiting
│   ├── validation.js        # Request validation
│   ├── errorHandler.js      # Global error handling
│   └── logger.js            # Request logging
├── controllers/              # Request handlers
│   ├── AuthController.js    # Authentication logic
│   ├── PropertyController.js # Property operations
│   ├── UserController.js    # User management
│   ├── SearchController.js  # Search operations
│   └── AnalyticsController.js # Analytics and insights
├── services/                 # Business logic layer
│   ├── AuthService.js       # Authentication business logic
│   ├── PropertyService.js   # Property data operations
│   ├── SearchService.js     # Search and filtering logic
│   ├── NotificationService.js # Push notifications
│   ├── AIService.js         # Claude API integration
│   └── CacheService.js      # Redis caching operations
└── routes/                   # Route definitions
    ├── auth.js              # Authentication routes
    ├── properties.js        # Property routes
    ├── users.js             # User routes
    ├── searches.js          # Search routes
    └── admin.js             # Admin panel routes
```

### Web Scraping Engine (`src/crawler/`)
```
src/crawler/
├── index.js                  # Main crawler orchestrator
├── scheduler.js              # Cron job scheduling
├── queue.js                 # Bull job queue management
├── scrapers/                 # Platform-specific scrapers
│   ├── base/                # Base scraper classes
│   │   ├── BaseScraper.js   # Abstract base scraper
│   │   ├── StagehandScraper.js # Stagehand integration
│   │   └── RateLimiter.js   # Request rate limiting
│   ├── platforms/           # Specific platform scrapers
│   │   ├── FiveNineOneScraper.js  # 591.com.tw
│   │   ├── RakuyaScraper.js       # Rakuya.com.tw
│   │   ├── HouseFunScraper.js     # HouseFun.com.tw
│   │   └── FacebookScraper.js     # Facebook groups
│   └── utils/               # Scraper utilities
│       ├── selectors.js     # CSS selectors constants
│       ├── parsers.js       # Data parsing utilities
│       └── validators.js    # Data validation
├── processors/               # Data processing pipeline
│   ├── DataNormalizer.js    # Normalize data across sources
│   ├── DuplicateDetector.js # Identify duplicate listings
│   ├── PriceAnalyzer.js     # Price validation and analysis
│   ├── LocationProcessor.js  # Address geocoding
│   └── ImageProcessor.js    # Image URL processing
├── storage/                  # Data persistence
│   ├── PropertyRepository.js # Database operations
│   ├── CacheRepository.js   # Redis operations
│   └── FileStorage.js       # File system operations
└── monitoring/               # Scraper monitoring
    ├── MetricsCollector.js  # Performance metrics
    ├── ErrorTracker.js      # Error monitoring
    └── HealthChecker.js     # Scraper health checks
```

### Database Layer (`src/database/`)
```
src/database/
├── client.js                 # Prisma client configuration
├── migrations/               # Prisma migrations
│   ├── 20240101_init/       # Initial schema migration
│   ├── 20240115_users/      # User system migration
│   ├── 20240120_searches/   # Saved searches migration
│   └── 20240125_indexes/    # Performance indexes
├── seeders/                 # Database seeding
│   ├── users.js             # Initial user accounts
│   ├── properties.js        # Sample property data
│   └── districts.js         # Taipei district data
├── repositories/             # Data access layer
│   ├── PropertyRepository.js # Property CRUD operations
│   ├── UserRepository.js    # User management operations
│   ├── SearchRepository.js  # Saved search operations
│   └── AnalyticsRepository.js # Analytics queries
└── models/                   # Database models (Prisma)
    ├── Property.js          # Property model extensions
    ├── User.js              # User model extensions
    └── Search.js            # Search model extensions
```

### AI Services (`src/services/`)
```
src/services/
├── ai/                       # AI-powered features
│   ├── ClaudeService.js     # Claude API integration
│   ├── NLPService.js        # Natural language processing
│   ├── RecommendationEngine.js # Property recommendations
│   ├── InsightGenerator.js  # Market insights
│   └── SearchEnhancer.js    # AI-enhanced search
├── external/                 # External API integrations
│   ├── GoogleMapsService.js # Geocoding and places
│   ├── LineNotifyService.js # LINE Notify integration
│   ├── EmailService.js      # Email notifications
│   └── SMSService.js        # SMS notifications
├── analytics/                # Analytics and metrics
│   ├── MarketAnalyzer.js    # Market trend analysis
│   ├── PricePredictor.js    # Price prediction models
│   ├── UserAnalytics.js     # User behavior analytics
│   └── PropertyAnalytics.js # Property performance metrics
└── core/                     # Core business services
    ├── PropertyService.js   # Property operations
    ├── UserService.js       # User management
    ├── SearchService.js     # Search functionality
    ├── NotificationService.js # Notification management
    └── CacheService.js      # Caching operations
```

### Utilities (`src/utils/`)
```
src/utils/
├── config/                   # Configuration management
│   ├── database.js          # Database configuration
│   ├── redis.js             # Redis configuration
│   ├── api-keys.js          # API key management
│   └── environment.js       # Environment variables
├── helpers/                  # Helper functions
│   ├── formatters.js        # Data formatting utilities
│   ├── validators.js        # Input validation schemas
│   ├── crypto.js            # Encryption/decryption
│   ├── dateTime.js          # Date/time utilities
│   └── string.js            # String manipulation
├── constants/                # Application constants
│   ├── districts.js         # Taipei district mappings
│   ├── property-types.js    # Property type definitions
│   ├── error-codes.js       # Error code constants
│   └── api-responses.js     # Standard API responses
├── middleware/               # Shared middleware
│   ├── asyncHandler.js      # Async error handling
│   ├── apiResponse.js       # Response formatting
│   └── requestId.js         # Request ID generation
└── logger/                   # Logging configuration
    ├── winston.js           # Winston logger setup
    ├── formatters.js        # Log formatting
    └── transports.js        # Log transports
```

## 🎨 Frontend Structure (`frontend/`)

### Next.js Application Organization
```
frontend/
├── components/               # Reusable React components
│   ├── common/              # Common UI components
│   │   ├── Button/          # Button component variants
│   │   ├── Input/           # Form input components
│   │   ├── Modal/           # Modal dialogs
│   │   ├── Loading/         # Loading indicators
│   │   └── Layout/          # Page layout components
│   ├── property/            # Property-specific components
│   │   ├── PropertyCard/    # Property listing card
│   │   ├── PropertyDetails/ # Property detail view
│   │   ├── PropertyMap/     # Map integration
│   │   ├── PropertyFilters/ # Search filters
│   │   └── PropertyGallery/ # Image gallery
│   ├── search/              # Search-related components
│   │   ├── SearchBar/       # Main search interface
│   │   ├── FilterPanel/     # Advanced filters
│   │   ├── ResultsList/     # Search results display
│   │   └── SavedSearches/   # Saved searches management
│   └── user/                # User-related components
│       ├── Profile/         # User profile management
│       ├── Preferences/     # User preferences
│       ├── Notifications/   # Notification settings
│       └── Dashboard/       # User dashboard
├── pages/                    # Next.js pages
│   ├── _app.tsx             # App component wrapper
│   ├── _document.tsx        # Document component
│   ├── index.tsx            # Home page
│   ├── search/              # Search pages
│   │   ├── index.tsx        # Main search page
│   │   └── [id].tsx         # Property detail page
│   ├── user/                # User pages
│   │   ├── login.tsx        # Login page
│   │   ├── register.tsx     # Registration page
│   │   ├── dashboard.tsx    # User dashboard
│   │   └── settings.tsx     # User settings
│   └── api/                 # Next.js API routes (if needed)
├── hooks/                    # Custom React hooks
│   ├── useAuth.ts           # Authentication hook
│   ├── useProperties.ts     # Property data hook
│   ├── useSearch.ts         # Search functionality hook
│   ├── useNotifications.ts  # Notifications hook
│   └── useLocalStorage.ts   # Local storage hook
├── services/                 # Frontend API services
│   ├── api.ts               # Base API client
│   ├── auth.ts              # Authentication API
│   ├── properties.ts        # Property API calls
│   ├── users.ts             # User management API
│   └── searches.ts          # Search API calls
├── styles/                   # Styling
│   ├── globals.css          # Global styles
│   ├── components/          # Component-specific styles
│   ├── pages/               # Page-specific styles
│   └── utils.css            # Utility classes
├── types/                    # TypeScript definitions
│   ├── api.ts               # API response types
│   ├── property.ts          # Property data types
│   ├── user.ts              # User data types
│   └── search.ts            # Search-related types
├── public/                   # Static assets
│   ├── images/              # Image assets
│   ├── icons/               # Icon assets
│   └── manifest.json        # PWA manifest
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Frontend dependencies
```

## 🧪 Testing Structure (`tests/`)

### Test Organization
```
tests/
├── unit/                     # Unit tests
│   ├── services/            # Service layer tests
│   ├── controllers/         # Controller tests
│   ├── utils/               # Utility function tests
│   └── models/              # Database model tests
├── integration/              # Integration tests
│   ├── api/                 # API endpoint tests
│   ├── database/            # Database integration tests
│   ├── crawler/             # Scraper integration tests
│   └── external/            # External API tests
├── e2e/                     # End-to-end tests
│   ├── user-flows/          # Complete user scenarios
│   ├── scraper-flows/       # Scraping workflows
│   └── admin-flows/         # Admin functionality
├── fixtures/                 # Test data and mocks
│   ├── properties.json      # Sample property data
│   ├── users.json           # Test user accounts
│   ├── api-responses/       # Mock API responses
│   └── html-pages/          # Mock HTML for scrapers
├── utils/                    # Test utilities
│   ├── db-helper.js         # Database test helpers
│   ├── api-helper.js        # API test utilities
│   ├── mock-server.js       # Mock server setup
│   └── test-data.js         # Test data generators
├── setup/                    # Test environment setup
│   ├── jest.config.js       # Jest configuration
│   ├── setupTests.js        # Test setup and teardown
│   └── testDb.js            # Test database configuration
└── coverage/                 # Test coverage reports
    ├── lcov-report/         # LCOV coverage report
    └── clover.xml           # Clover coverage report
```

## 📋 File Naming Conventions

### General Naming Rules
- **Directories**: kebab-case (`property-details`, `user-auth`)
- **JavaScript Files**: camelCase (`propertyService.js`, `userController.js`)
- **TypeScript Files**: PascalCase for classes (`PropertyService.ts`), camelCase for utilities (`formatUtils.ts`)
- **React Components**: PascalCase (`PropertyCard.tsx`, `SearchBar.tsx`)
- **CSS Files**: kebab-case (`property-card.css`, `search-bar.css`)
- **Test Files**: Same as source with `.test.js` or `.spec.js` suffix

### Specific Patterns
- **API Routes**: HTTP method prefix (`getProperties.js`, `postSearch.js`)
- **Database Models**: PascalCase singular (`Property.js`, `User.js`)
- **Scrapers**: Source name + "Scraper" (`FiveNineOneScraper.js`)
- **Services**: Purpose + "Service" (`EmailService.js`, `CacheService.js`)
- **Utilities**: Purpose + "Utils" (`dateUtils.js`, `validationUtils.js`)

## 🔄 Development Workflow

### Branch Strategy
```
main                    # Production-ready code
├── develop            # Integration branch
├── feature/           # Feature development
│   ├── user-auth      # Authentication system
│   ├── property-search # Search functionality
│   └── ai-integration # AI features
├── hotfix/            # Critical bug fixes
└── release/           # Release preparation
```

### Git Commit Convention
```
feat: add property search with AI integration
fix: resolve duplicate property detection bug
docs: update API documentation for search endpoints
style: format code according to ESLint rules
refactor: reorganize scraper architecture
test: add unit tests for property service
chore: update dependencies and configurations
```

### Code Review Process
1. **Feature Development**: Create feature branch from `develop`
2. **Pull Request**: Submit PR with detailed description
3. **Code Review**: At least one team member reviews
4. **Testing**: Automated tests must pass
5. **Merge**: Squash merge to `develop`
6. **Release**: Merge `develop` to `main` for deployment

## 📦 Package Management

### Dependency Categories
```json
{
  "dependencies": {
    // Core framework dependencies
    "express": "^4.18.2",
    "next": "^14.0.0",
    
    // Database and ORM
    "@prisma/client": "^5.7.0",
    "prisma": "^5.7.0",
    
    // AI and scraping
    "@browserbasehq/stagehand": "latest",
    "@anthropic-ai/sdk": "^0.10.0",
    
    // Utilities
    "axios": "^1.6.2",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    // Testing framework
    "jest": "^29.7.0",
    "@testing-library/react": "^13.4.0",
    
    // Code quality
    "eslint": "^8.56.0",
    "prettier": "^3.1.0",
    
    // TypeScript
    "typescript": "^5.3.3",
    "@types/node": "^20.10.5"
  }
}
```

### Module Resolution
- Use absolute imports for `src/` directory
- Prefer named exports over default exports
- Group imports: external → internal → relative
- Use index files for clean imports from directories

This structure provides a scalable foundation for the Taipei Rental Hub platform while maintaining clear separation of concerns and supporting future growth.