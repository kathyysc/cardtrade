import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../services/AuthContext'

/**
 * 登入頁面
 */
export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  // 處理登入
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('請填寫用戶名和密碼')
      return
    }

    setLoading(true)
    try {
      await login(username.trim(), password)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.detail || '登入失敗，請檢查用戶名和密碼'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* 標題 */}
        <div className="text-center mb-8">
          <span className="text-4xl">🃏</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">登入 CardTrade</h1>
          <p className="text-gray-500 mt-1">歡迎回來！</p>
        </div>

        {/* 登入表單 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
          {/* 錯誤訊息 */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              ⚠️ {error}
            </div>
          )}

          {/* 用戶名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              用戶名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="輸入你的用戶名"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              disabled={loading}
            />
          </div>

          {/* 密碼 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              密碼
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="輸入你的密碼"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              disabled={loading}
            />
          </div>

          {/* 登入按鈕 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                登入中...
              </span>
            ) : (
              '登入'
            )}
          </button>

          {/* 註冊連結 */}
          <p className="text-center text-sm text-gray-500">
            還沒有帳號？
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium ml-1">
              免費註冊
            </Link>
          </p>

          {/* 測試帳號提示 */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-600">
            💡 測試帳號：用戶名 <strong>kathy</strong> / 密碼 <strong>password123</strong>
          </div>
        </form>
      </div>
    </div>
  )
}
