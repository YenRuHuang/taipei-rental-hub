'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, MicrophoneIcon } from '@heroicons/react/24/outline'
import { searchService } from '@/services/searchService'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()

  const handleSearch = async (searchQuery?: string) => {
    const finalQuery = searchQuery || query
    if (!finalQuery.trim()) {
      toast.error('請輸入搜尋條件')
      return
    }

    setIsSearching(true)
    
    try {
      // 使用 AI 自然語言搜尋
      const results = await searchService.naturalLanguageSearch(finalQuery)
      
      // 導航到搜尋結果頁面
      const searchParams = new URLSearchParams({
        q: finalQuery,
        type: 'natural'
      })
      router.push(`/search?${searchParams.toString()}`)
      
    } catch (error) {
      console.error('Search error:', error)
      toast.error('搜尋失敗，請稍後再試')
    } finally {
      setIsSearching(false)
    }
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    if (value.length >= 2) {
      try {
        const response = await searchService.getSuggestions(value)
        setSuggestions(response.suggestions)
        setShowSuggestions(true)
      } catch (error) {
        console.error('Get suggestions error:', error)
      }
    } else {
      setShowSuggestions(false)
    }
  }

  const selectSuggestion = (suggestion: any) => {
    setQuery(suggestion.value)
    setShowSuggestions(false)
    handleSearch(suggestion.value)
  }

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          placeholder="試試：大安區2萬以內近捷運可養寵物的套房"
          value={query}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="block w-full pl-10 pr-20 py-4 border border-transparent rounded-xl text-lg bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500"
          disabled={isSearching}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 mr-2"
            title="語音搜尋"
          >
            <MicrophoneIcon className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => handleSearch()}
            disabled={isSearching}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed mr-2 transition-colors"
          >
            {isSearching ? (
              <div className="loading-spinner"></div>
            ) : (
              '搜尋'
            )}
          </button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion: any, index: number) => (
            <button
              key={index}
              onClick={() => selectSuggestion(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2 min-w-0">
                  {suggestion.type === 'district' && '📍'}
                  {suggestion.type === 'mrt' && '🚇'}
                  {suggestion.type === 'roomType' && '🏠'}
                </span>
                <span className="text-gray-900">{suggestion.value}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar