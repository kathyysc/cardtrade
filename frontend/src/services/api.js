/**
 * API 服務 — 與後端通訊的 HTTP 客戶端
 * 所有 API 請求都集中在這裡
 */
import axios from 'axios'

// 建立 axios 實例
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ==================== 請求攔截器：自動附帶 JWT Token ====================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cardtrade_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ==================== 回應攔截器：處理認證錯誤 ====================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token 過期或無效，清除並跳轉到登入頁
      localStorage.removeItem('cardtrade_token')
      localStorage.removeItem('cardtrade_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ==================== 認證 API ====================

export const authAPI = {
  /** 用戶註冊 */
  register: (data) => api.post('/auth/register', data),

  /** 用戶登入 */
  login: (data) => api.post('/auth/login', data),

  /** 取得當前用戶資訊 */
  getMe: () => api.get('/auth/me'),

  /** 更新用戶資訊 */
  updateMe: (data) => api.put('/auth/me', data),
}

// ==================== 卡片 API ====================

export const cardsAPI = {
  /** 取得卡片列表 */
  list: (params) => api.get('/cards/', { params }),

  /** 取得單張卡片 */
  get: (id) => api.get(`/cards/${id}`),

  /** 建立卡片 */
  create: (data) => api.post('/cards/', data),

  /** 更新卡片 */
  update: (id, data) => api.put(`/cards/${id}`, data),

  /** 刪除卡片 */
  delete: (id) => api.delete(`/cards/${id}`),
}

// ==================== 刊登 API ====================

export const listingsAPI = {
  /** 瀏覽刊登列表（含搜尋篩選） */
  list: (params) => api.get('/listings/', { params }),

  /** 取得刊登詳情 */
  get: (id) => api.get(`/listings/${id}`),

  /** 建立刊登 */
  create: (data) => api.post('/listings/', data),

  /** 更新刊登 */
  update: (id, data) => api.put(`/listings/${id}`, data),

  /** 刪除（取消）刊登 */
  delete: (id) => api.delete(`/listings/${id}`),

  /** 我的刊登 */
  myListings: () => api.get('/listings/my'),
}

// ==================== 圖片上傳 + AI 識別 API ====================

export const uploadAPI = {
  /** 上傳圖片進行 AI 識別 */
  recognize: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload/recognize', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  /** 上傳圖片並建立卡片 */
  createWithImage: (file, cardData) => {
    const formData = new FormData()
    formData.append('file', file)
    Object.entries(cardData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value)
      }
    })
    return api.post('/upload/listing', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export default api
