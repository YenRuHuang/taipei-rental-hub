'use client'

import { useState } from 'react'
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'

export interface FilterState {
  district: string
  minPrice: string
  maxPrice: string
  minArea: string
  maxArea: string
  roomType: string
  nearMRT: string
  hasParking: boolean
  hasPet: boolean
  hasCooking: boolean
  hasElevator: boolean
  hasBalcony: boolean
}

interface FilterPanelProps {
  onFiltersChange?: (filters: FilterState) => void
  initialFilters?: Partial<FilterState>
}

const DISTRICTS = [
  '中正區', '大同區', '中山區', '松山區', '大安區', '萬華區',
  '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'
]

const ROOM_TYPES = [
  '套房', '雅房', '1房1廳', '2房1廳', '2房2廳', '3房2廳', '4房2廳', '5房以上'
]

const PRICE_RANGES = [
  { label: '1萬以下', min: '', max: '10000' },
  { label: '1-1.5萬', min: '10000', max: '15000' },
  { label: '1.5-2萬', min: '15000', max: '20000' },
  { label: '2-2.5萬', min: '20000', max: '25000' },
  { label: '2.5-3萬', min: '25000', max: '30000' },
  { label: '3-4萬', min: '30000', max: '40000' },
  { label: '4-5萬', min: '40000', max: '50000' },
  { label: '5萬以上', min: '50000', max: '' },
]

export function FilterPanel({ onFiltersChange, initialFilters = {} }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    district: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
    roomType: '',
    nearMRT: '',
    hasParking: false,
    hasPet: false,
    hasCooking: false,
    hasElevator: false,
    hasBalcony: false,
    ...initialFilters,
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const applyPriceRange = (range: { min: string; max: string }) => {
    setFilters(prev => ({
      ...prev,
      minPrice: range.min,
      maxPrice: range.max,
    }))
    onFiltersChange?.({
      ...filters,
      minPrice: range.min,
      maxPrice: range.max,
    })
  }

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      district: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
      roomType: '',
      nearMRT: '',
      hasParking: false,
      hasPet: false,
      hasCooking: false,
      hasElevator: false,
      hasBalcony: false,
    }
    setFilters(emptyFilters)
    onFiltersChange?.(emptyFilters)
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    typeof value === 'boolean' ? value : value !== ''
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FunnelIcon className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">篩選條件</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
          >
            <XMarkIcon className="w-4 h-4 mr-1" />
            清除所有
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 區域 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            行政區
          </label>
          <select
            value={filters.district}
            onChange={(e) => updateFilter('district', e.target.value)}
            className="input"
          >
            <option value="">不限</option>
            {DISTRICTS.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        {/* 房型 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            房型
          </label>
          <select
            value={filters.roomType}
            onChange={(e) => updateFilter('roomType', e.target.value)}
            className="input"
          >
            <option value="">不限</option>
            {ROOM_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* 捷運站 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            鄰近捷運站
          </label>
          <input
            type="text"
            placeholder="例：台北車站"
            value={filters.nearMRT}
            onChange={(e) => updateFilter('nearMRT', e.target.value)}
            className="input"
          />
        </div>

        {/* 價格範圍快選 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            租金範圍
          </label>
          <div className="flex flex-wrap gap-1">
            {PRICE_RANGES.slice(0, 4).map((range, index) => (
              <button
                key={index}
                onClick={() => applyPriceRange(range)}
                className={`text-xs px-2 py-1 rounded ${
                  filters.minPrice === range.min && filters.maxPrice === range.max
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 進階選項 */}
      <div className="mt-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          {showAdvanced ? '收起' : '展開'}進階選項
        </button>

        {showAdvanced && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 自定義價格範圍 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最低租金
              </label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => updateFilter('minPrice', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最高租金
              </label>
              <input
                type="number"
                placeholder="無上限"
                value={filters.maxPrice}
                onChange={(e) => updateFilter('maxPrice', e.target.value)}
                className="input"
              />
            </div>

            {/* 坪數範圍 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最小坪數
              </label>
              <input
                type="number"
                placeholder="0"
                value={filters.minArea}
                onChange={(e) => updateFilter('minArea', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最大坪數
              </label>
              <input
                type="number"
                placeholder="無上限"
                value={filters.maxArea}
                onChange={(e) => updateFilter('maxArea', e.target.value)}
                className="input"
              />
            </div>

            {/* 特殊需求 */}
            <div className="md:col-span-2 lg:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                特殊需求
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { key: 'hasParking', label: '附停車位' },
                  { key: 'hasPet', label: '可養寵物' },
                  { key: 'hasCooking', label: '可開伙' },
                  { key: 'hasElevator', label: '有電梯' },
                  { key: 'hasBalcony', label: '有陽台' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters[key as keyof FilterState] as boolean}
                      onChange={(e) => updateFilter(key as keyof FilterState, e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}