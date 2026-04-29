import { Link } from 'react-router-dom'
import { useAuth } from '../services/AuthContext'
import { useEffect, useState } from 'react'
import { listingsAPI } from '../services/api'
import ListingCard from '../components/ListingCard'
import { formatPrice } from '../services/constants'

/**
 * 儀表板頁面 — 登入後的首頁，顯示個人摘要和最近刊登
 */
export default function DashboardPage() {
  const { user } = useAuth()
  const [recentListings, setRecentListings] = useState([])
  const [myListings, setMyListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      // 載入最近的刊登（公開）
      const recentRes = await listingsAPI.list({ page: 1, page_size: 6 })
      setRecentListings(recentRes.data.items || [])

      // 載入我的刊登
      const myRes = await listingsAPI.myListings()
      setMyListings(myRes.data || [])
    } catch (err) {
      console.error('載入儀表板失敗：', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="loading-spinner w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  // 計算我的刊登統計
  const activeListings = myListings.filter(l => l.status === 'active')
  const totalValue = activeListings.reduce((sum, l) => sum + (l.price_hkd * l.quantity), 0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 歡迎區域 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          👋 歡迎回來，{user?.display_name || user?.username}！
        </h1>
        <p className="text-gray-500 mt-1">這裡是你的交易儀表板</p>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">我的刊登數</p>
          <p className="text-3xl font-bold text-gray-900">{activeListings.length}</p>
          <p className="text-xs text-gray-400 mt-1">筆進行中的刊登</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">刊登總值</p>
          <p className="text-3xl font-bold text-primary-600">{formatPrice(totalValue)}</p>
          <p className="text-xs text-gray-400 mt-1">所有刊登的估計價值</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">刊登卡片數</p>
          <p className="text-3xl font-bold text-gray-900">
            {activeListings.reduce((sum, l) => sum + l.quantity, 0)}
          </p>
          <p className="text-xs text-gray-400 mt-1">張正在出售的卡牌</p>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link
          to="/sell"
          className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl p-6 hover:from-primary-600 hover:to-primary-700 transition-all shadow-sm"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">📸</span>
            <div>
              <h3 className="font-bold text-lg">開始賣卡</h3>
              <p className="text-orange-100 text-sm">拍張照片，AI 自動識別並刊登</p>
            </div>
          </div>
        </Link>
        <Link
          to="/browse"
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:border-primary-200 transition-all"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">🔍</span>
            <div>
              <h3 className="font-bold text-lg text-gray-900">瀏覽卡牌</h3>
              <p className="text-gray-500 text-sm">搜尋和篩選你想要的卡牌</p>
            </div>
          </div>
        </Link>
      </div>

      {/* 最近刊登 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900"> 最新刊登</h2>
          <Link to="/browse" className="text-sm text-primary-600 hover:text-primary-700">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onClick={() => window.location.href = `/listing/${listing.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
