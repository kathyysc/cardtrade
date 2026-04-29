import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { listingsAPI } from '../services/api'
import { formatPrice, formatDate, getConditionClass, getRarityClass } from '../services/constants'

/**
 * 我的刊登頁面 — 管理自己的刊登（上架/下架）
 */
export default function MyListingsPage() {
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadMyListings()
  }, [])

  const loadMyListings = async () => {
    setLoading(true)
    try {
      const response = await listingsAPI.myListings()
      setListings(response.data || [])
    } catch (err) {
      setError('載入刊登列表失敗')
    } finally {
      setLoading(false)
    }
  }

  // 取消刊登
  const handleCancel = async (listingId) => {
    if (!window.confirm('確定要取消此刊登嗎？')) return

    try {
      await listingsAPI.delete(listingId)
      // 更新本地列表
      setListings(prev => prev.map(l =>
        l.id === listingId ? { ...l, status: 'cancelled' } : l
      ))
    } catch (err) {
      alert('取消刊登失敗：' + (err.response?.data?.detail || err.message))
    }
  }

  // 活躍刊登
  const activeListings = listings.filter(l => l.status === 'active')
  const cancelledListings = listings.filter(l => l.status !== 'active')

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="loading-spinner w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* 標題 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📦 我的刊登</h1>
          <p className="text-gray-500 text-sm mt-1">
            共 {activeListings.length} 筆進行中
          </p>
        </div>
        <button
          onClick={() => navigate('/sell')}
          className="px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors text-sm"
        >
          + 新增刊登
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 mb-4">
          ⚠️ {error}
        </div>
      )}

      {/* 進行中的刊登 */}
      {activeListings.length > 0 ? (
        <div className="space-y-3 mb-8">
          {activeListings.map(listing => (
            <div
              key={listing.id}
              onClick={() => navigate(`/listing/${listing.id}`)}
              className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 card-hover cursor-pointer"
            >
              {/* 卡片圖標 */}
              <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-2xl">🃏</span>
              </div>

              {/* 卡片資訊 */}
              <div className="flex-grow min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm truncate">
                  {listing.card?.card_name || '未知卡片'}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getConditionClass(listing.condition)}`}>
                    {listing.condition === 'Near Mint' ? 'NM' :
                     listing.condition === 'Lightly Played' ? 'LP' :
                     listing.condition === 'Moderately Played' ? 'MP' :
                     listing.condition === 'Heavily Played' ? 'HP' : 'D'}
                  </span>
                  {listing.card?.rarity && (
                    <span className={`text-xs ${getRarityClass(listing.card.rarity)}`}>
                      {listing.card.rarity}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(listing.created_at)} · 數量 {listing.quantity}
                </p>
              </div>

              {/* 價格 */}
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-primary-600">
                  {formatPrice(listing.price_hkd)}
                </p>
              </div>

              {/* 操作 */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleCancel(listing.id)
                }}
                className="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors shrink-0"
              >
                取消
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 mb-8">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-500 mb-4">還沒有任何刊登</p>
          <button
            onClick={() => navigate('/sell')}
            className="px-6 py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
          >
            開始刊登
          </button>
        </div>
      )}

      {/* 已取消的刊登 */}
      {cancelledListings.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">已取消的刊登</h2>
          <div className="space-y-3">
            {cancelledListings.map(listing => (
              <div
                key={listing.id}
                className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 opacity-60"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-2xl">🃏</span>
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold text-gray-500 text-sm truncate">
                    {listing.card?.card_name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatPrice(listing.price_hkd)} · 已取消
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
