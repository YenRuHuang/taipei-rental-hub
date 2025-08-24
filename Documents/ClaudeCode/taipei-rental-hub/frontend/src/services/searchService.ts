import { apiClient } from './apiClient'

export interface SearchFilters {
  district?: string
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  roomType?: string
  nearMRT?: string
  hasParking?: boolean
  hasPet?: boolean
  hasCooking?: boolean
  hasElevator?: boolean
  hasBalcony?: boolean
}

export interface SearchResult {
  properties: Property[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  searchCriteria?: SearchFilters
  parsedCriteria?: SearchFilters
}

export interface Property {
  id: string
  title: string
  price: number
  deposit?: string
  district: string
  address: string
  nearMRT?: string
  area?: number
  roomType: string
  floor?: string
  totalFloors?: string
  hasParking: boolean
  hasPet: boolean
  hasCooking: boolean
  hasElevator: boolean
  hasBalcony: boolean
  hasWasher: boolean
  contactName?: string
  contactPhone?: string
  url: string
  images: PropertyImage[]
  features: PropertyFeature[]
  viewCount: number
  createdAt: string
  updatedAt: string
  _count: {
    favorites: number
  }
}

export interface PropertyImage {
  id: string
  url: string
  type: string
  order: number
}

export interface PropertyFeature {
  id: string
  feature: string
  category?: string
}

export interface SearchAlert {
  id: string
  name: string
  criteria: SearchFilters
  isActive: boolean
  notifyEmail: boolean
  notifyLine: boolean
  createdAt: string
  updatedAt: string
}

export interface SearchHistory {
  id: string
  query?: string
  criteria: SearchFilters
  resultCount: number
  createdAt: string
}

class SearchService {
  // 自然語言搜尋
  async naturalLanguageSearch(query: string, options: { page?: number; limit?: number } = {}): Promise<SearchResult> {
    const response = await apiClient.post('/search/natural', {
      query,
      ...options,
    })
    return response.data
  }

  // 結構化搜尋
  async search(filters: SearchFilters & { page?: number; limit?: number; sortBy?: string; sortOrder?: string }): Promise<SearchResult> {
    const response = await apiClient.get('/search', {
      params: filters,
    })
    return response.data
  }

  // 取得搜尋建議
  async getSuggestions(query: string): Promise<{ suggestions: Array<{ type: string; value: string }> }> {
    const response = await apiClient.get('/search/suggestions', {
      params: { q: query },
    })
    return response.data
  }

  // 建立搜尋提醒
  async createSearchAlert(data: {
    name: string
    criteria: SearchFilters
    notifyEmail?: boolean
    notifyLine?: boolean
  }): Promise<{ message: string; alert: SearchAlert }> {
    const response = await apiClient.post('/search/alert', data)
    return response.data
  }

  // 取得使用者的搜尋提醒
  async getSearchAlerts(): Promise<{ alerts: SearchAlert[] }> {
    const response = await apiClient.get('/search/alerts')
    return response.data
  }

  // 更新搜尋提醒
  async updateSearchAlert(id: string, data: Partial<SearchAlert>): Promise<{ message: string }> {
    const response = await apiClient.put(`/search/alerts/${id}`, data)
    return response.data
  }

  // 刪除搜尋提醒
  async deleteSearchAlert(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/search/alerts/${id}`)
    return response.data
  }

  // 取得搜尋歷史
  async getSearchHistory(limit: number = 20): Promise<{ history: SearchHistory[] }> {
    const response = await apiClient.get('/search/history', {
      params: { limit },
    })
    return response.data
  }
}

export const searchService = new SearchService()