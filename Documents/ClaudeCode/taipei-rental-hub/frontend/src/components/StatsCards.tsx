'use client'

import { useState, useEffect } from 'react'
import { HomeIcon, CurrencyDollarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'

interface Stats {
  totalProperties: number
  avgPrice: number
  recentAdditions: number
  districtCount: number
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats>({
    totalProperties: 0,
    avgPrice: 0,
    recentAdditions: 0,
    districtCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // 這裡會調用實際的 API
      // const response = await propertyService.getStats()
      
      // 暫時使用模擬資料
      setTimeout(() => {
        setStats({
          totalProperties: 12847,
          avgPrice: 28500,
          recentAdditions: 156,
          districtCount: 12,
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('zh-TW').format(num)
  }

  const cards = [
    {
      title: '總房源數',
      value: formatNumber(stats.totalProperties),
      icon: HomeIcon,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: '平均租金',
      value: `NT$ ${formatNumber(stats.avgPrice)}`,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: '24小時新增',
      value: formatNumber(stats.recentAdditions),
      icon: ClockIcon,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      title: '涵蓋區域',
      value: `${stats.districtCount} 個行政區`,
      icon: MapPinIcon,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-xl p-6 shadow-sm border border-gray-200 bg-white animate-slide-up`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </p>
              {loading ? (
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">
                  {card.value}
                </p>
              )}
            </div>
            <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}