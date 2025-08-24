'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, MapPinIcon, CurrencyDollarIcon, HomeIcon } from '@heroicons/react/24/outline'
import { SearchBar } from '@/components/SearchBar'
import { PropertyCard } from '@/components/PropertyCard'
import { FilterPanel } from '@/components/FilterPanel'
import { StatsCards } from '@/components/StatsCards'

export default function Home() {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              找到理想租屋
            </h1>
            <p className="text-xl md:text-2xl text-primary-100">
              AI 智能整合台北所有租屋平台，讓找房變得簡單
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <StatsCards />
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            為什麼選擇我們？
          </h2>
          <p className="text-xl text-gray-600">
            整合所有主要租屋平台，提供最全面的房源資訊
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlassIcon className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">智能搜尋</h3>
            <p className="text-gray-600">
              自然語言搜尋，AI 理解您的需求
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPinIcon className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">全台北覆蓋</h3>
            <p className="text-gray-600">
              整合 591、樂屋網、好房網等主要平台
            </p>
          </div>

          <div className="text-center">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CurrencyDollarIcon className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">價格追蹤</h3>
            <p className="text-gray-600">
              即時價格變動通知，掌握市場動態
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <HomeIcon className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">個人化推薦</h3>
            <p className="text-gray-600">
              根據您的偏好智能推薦合適房源
            </p>
          </div>
        </div>
      </div>

      {/* Recent Properties Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                最新房源
              </h2>
              <p className="text-gray-600">
                剛上架的優質租屋選擇
              </p>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline"
            >
              <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
              篩選條件
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mb-8">
              <FilterPanel />
            </div>
          )}

          {/* Properties Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Placeholder for property cards */}
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-8">
            <button className="btn-primary">
              載入更多房源
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            開始您的找房之旅
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            立即使用 AI 智能搜尋，找到理想的租屋
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              開始搜尋
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
              查看地圖
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}