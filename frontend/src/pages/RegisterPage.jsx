import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../services/AuthContext'

/**
 * 註冊頁面
 */
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    whatsapp: '',
    display_name: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  // 處理輸入變更
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // 處理註冊
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // 表單驗證
    if (!formData.username.trim() || !formData.email.trim() || !formData.password) {
      setError('請填寫所有必填欄位')
      return
    }
    if (formData.username.trim().length < 3) {
      setError('用戶名至少需要 3 個字元')
      return
    }
    if (formData.password.length < 6) {
      setError('密碼至少需要 6 個字元')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('兩次輸入的密碼不一致')
      return
    }

    setLoading(true)
    try {
      const { confirmPassword, ...registerData } = formData
      await register(registerData)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.detail || '註冊失敗，請稍後再試'
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
          <h1 className="text-2xl font-bold text-gray-900 mt-2">註冊 CardTrade</h1>
          <p className="text-gray-500 mt-1">加入我們，開始交易卡牌！</p>
        </div>

        {/* 註冊表單 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
          {/* 錯誤訊息 */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              ⚠️ {error}
            </div>
          )}

          {/* 顯示名稱 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              顯示名稱 <span className="text-gray-400">（可選，預設使用用戶名）</span>
            </label>
            <input
              type="text"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              placeholder="例如：Kathy"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              disabled={loading}
            />
          </div>

          {/* 用戶名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              用戶名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="至少 3 個字元"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              disabled={loading}
            />
          </div>

          {/* 電郵 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              電郵 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              disabled={loading}
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp 號碼 <span className="text-gray-400">（選填，讓買家能聯繫你）</span>
            </label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="+85212345678"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-1">
              買家會透過此號碼聯繫你，請填寫正確的 WhatsApp 號碼
            </p>
          </div>

          {/* 密碼 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              密碼 <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="至少 6 個字元"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              disabled={loading}
            />
          </div>

          {/* 確認密碼 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              確認密碼 <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="再次輸入密碼"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              disabled={loading}
            />
          </div>

          {/* 註冊按鈕 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                註冊中...
              </span>
            ) : (
              '註冊'
            )}
          </button>

          {/* 登入連結 */}
          <p className="text-center text-sm text-gray-500">
            已有帳號？
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium ml-1">
              登入
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
