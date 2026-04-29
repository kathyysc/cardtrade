import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../services/AuthContext'

/**
 * 導航列元件 — 顯示在每個頁面的頂部
 */
export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // 登出處理
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // 判斷連結是否活躍（當前頁面）
  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🃏</span>
            <span className="text-xl font-bold text-primary-600">CardTrade</span>
          </Link>

          {/* 導航連結 */}
          <div className="hidden sm:flex items-center gap-1">
            <Link
              to="/browse"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/browse')
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              📋 瀏覽卡牌
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/sell"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/sell')
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  💰 賣卡
                </Link>
                <Link
                  to="/my-listings"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/my-listings')
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  📦 我的刊登
                </Link>
              </>
            )}
          </div>

          {/* 用戶區 */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden sm:inline">
                  👤 {user?.display_name || user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  登出
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-colors"
                >
                  登入
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
                >
                  註冊
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 手機版導航 */}
        <div className="sm:hidden flex gap-1 pb-2 overflow-x-auto">
          <Link
            to="/browse"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              isActive('/browse') ? 'bg-primary-50 text-primary-700' : 'text-gray-600'
            }`}
          >
            📋 瀏覽
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/sell"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  isActive('/sell') ? 'bg-primary-50 text-primary-700' : 'text-gray-600'
                }`}
              >
                💰 賣卡
              </Link>
              <Link
                to="/my-listings"
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  isActive('/my-listings') ? 'bg-primary-50 text-primary-700' : 'text-gray-600'
                }`}
              >
                📦 我的刊登
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
