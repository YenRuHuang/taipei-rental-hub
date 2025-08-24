import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// 創建 axios 實例
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token 管理
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return null
}

const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
  }
}

const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
  }
}

// 請求攔截器
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 響應攔截器
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Token 過期處理
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // 清除過期 token
      removeToken()
      
      // 重定向到登入頁面
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
      
      return Promise.reject(error)
    }

    // 處理其他錯誤
    const message = error.response?.data?.error || error.message || '請求失敗'
    
    // 在客戶端顯示錯誤提示
    if (typeof window !== 'undefined') {
      // 避免顯示重複的網絡錯誤
      if (!error.message.includes('Network Error')) {
        toast.error(message)
      }
    }

    return Promise.reject(error)
  }
)

// 身份驗證相關函數
export const authUtils = {
  setToken,
  getToken,
  removeToken,
  
  isAuthenticated: (): boolean => {
    const token = getToken()
    return !!token
  },
  
  logout: (): void => {
    removeToken()
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
  },
}

export default apiClient