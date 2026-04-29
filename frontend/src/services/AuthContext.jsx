import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from './api'

/**
 * 認證上下文 — 管理用戶登入狀態
 * 使用 React Context + localStorage 保存登入資訊
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 啟動時檢查是否有已保存的登入資訊
  useEffect(() => {
    const savedUser = localStorage.getItem('cardtrade_user')
    const savedToken = localStorage.getItem('cardtrade_token')
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        // 解析失敗，清除無效資料
        localStorage.removeItem('cardtrade_user')
        localStorage.removeItem('cardtrade_token')
      }
    }
    setLoading(false)
  }, [])

  /**
   * 登入
   * @param {string} username - 用戶名
   * @param {string} password - 密碼
   */
  const login = async (username, password) => {
    const response = await authAPI.login({ username, password })
    const { access_token, user: userData } = response.data

    // 保存到 localStorage
    localStorage.setItem('cardtrade_token', access_token)
    localStorage.setItem('cardtrade_user', JSON.stringify(userData))
    setUser(userData)

    return userData
  }

  /**
   * 註冊
   * @param {object} data - 註冊資料
   */
  const register = async (data) => {
    const response = await authAPI.register(data)
    const { access_token, user: userData } = response.data

    localStorage.setItem('cardtrade_token', access_token)
    localStorage.setItem('cardtrade_user', JSON.stringify(userData))
    setUser(userData)

    return userData
  }

  /**
   * 登出
   */
  const logout = () => {
    localStorage.removeItem('cardtrade_token')
    localStorage.removeItem('cardtrade_user')
    setUser(null)
  }

  /**
   * 更新用戶資訊
   */
  const updateProfile = async (data) => {
    const response = await authAPI.updateMe(data)
    const updatedUser = response.data
    localStorage.setItem('cardtrade_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    return updatedUser
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * 使用認證上下文的 Hook
 * 在任何元件中呼叫 useAuth() 來取得登入狀態和方法
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth 必須在 AuthProvider 內使用')
  }
  return context
}
