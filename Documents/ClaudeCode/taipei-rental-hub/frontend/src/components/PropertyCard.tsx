'use client'

import { useState } from 'react'
import { HeartIcon, MapPinIcon, HomeIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'
import { Property } from '@/services/searchService'

interface PropertyCardProps {
  property: Property
  onFavoriteToggle?: (propertyId: string, isFavorited: boolean) => void
  isFavorited?: boolean
}

export function PropertyCard({ property, onFavoriteToggle, isFavorited = false }: PropertyCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFavoriteToggle?.(property.id, !isFavorited)
  }

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
    }
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-TW').format(price)
  }

  const getFeatureBadges = () => {
    const badges = []
    if (property.hasParking) badges.push('停車位')
    if (property.hasPet) badges.push('可養寵物')
    if (property.hasCooking) badges.push('可開伙')
    if (property.hasElevator) badges.push('電梯')
    if (property.hasBalcony) badges.push('陽台')
    return badges.slice(0, 3) // 最多顯示3個
  }

  const currentImage = property.images[currentImageIndex]
  const featureBadges = getFeatureBadges()

  return (
    <Link href={`/properties/${property.id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
        {/* 圖片區域 */}
        <div className="relative aspect-video bg-gray-200">
          {currentImage ? (
            <Image
              src={currentImage.url}
              alt={property.title}
              fill
              className={`object-cover transition-opacity duration-300 ${
                isImageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setIsImageLoading(false)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <HomeIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* Loading skeleton */}
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}

          {/* 圖片導航 */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* 圖片指示器 */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {property.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* 收藏按鈕 */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
          >
            {isFavorited ? (
              <HeartSolidIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* 價格標籤 */}
          <div className="absolute top-3 left-3 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            NT$ {formatPrice(property.price)}
          </div>
        </div>

        {/* 內容區域 */}
        <div className="p-4">
          {/* 標題 */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {property.title}
          </h3>

          {/* 位置資訊 */}
          <div className="flex items-center text-gray-600 mb-2">
            <MapPinIcon className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {property.district}
              {property.nearMRT && ` • ${property.nearMRT}`}
            </span>
          </div>

          {/* 房屋資訊 */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-4">
              {property.roomType && (
                <span>{property.roomType}</span>
              )}
              {property.area && (
                <span>{property.area} 坪</span>
              )}
              {property.floor && (
                <span>{property.floor}F</span>
              )}
            </div>
          </div>

          {/* 特色標籤 */}
          {featureBadges.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {featureBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          {/* 底部資訊 */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <span>瀏覽 {property.viewCount} 次</span>
              {property._count.favorites > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <span>{property._count.favorites} 人收藏</span>
                </>
              )}
            </div>
            <div>
              {new Date(property.createdAt).toLocaleDateString('zh-TW')}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}