import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { listingsAPI } from '../services/api'
import ListingCard from '../components/ListingCard'
import { RARITIES, CONDITIONS, CARD_TYPES } from '../services/constants'

/**
 * 瀏覽頁面 — 搜尋和篩選卡片刊登
 */
export default function BrowsePage() {
  const navigate = useNavigate()

  // 刊登列表
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // 篩選條件
  const [filters, setFilters] = useState({
    keyword: '',
    rarity: '',
    card_type: '',
    condition: '',
    price_min: '',
    price_max: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    page: 1,
    page_size: 12,
  })

  // 是否顯示篩選面板（手機版）
  const [showFilters, setShowFilters] = useState(false)

  // 載入刊登列表
  useEffect(() => {
    loadListings()
  }, [filters])

  const loadListings = async () => {
    setLoading(true)
    try {
      // 移除空值參數
      const params = { ...filters }
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key]
        }
      })
      const response = await listingsAPI.list(params)
      setListings(response.data.items || [])
      setTotal(response.data.total || 0)
      setTotalPages(response.data.total_pages || 0)
    } catch (err) {
      console.error('載入刊登列表失敗：', err)
    } finally {
      setLoading(false)
    }
  }

  // 更新篩選條件
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  // 重置篩選
  const resetFilters = () => {
    setFilters({
      keyword: '',
      rarity: '',
      card_type: '',
      condition: '',
      price_min: '',
      price_max: '',
      sort_by: 'created_at',
      sort_order: 'desc',
      page: 1,
      page_size: 12,
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 標題 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📋 瀏覽卡牌</h1>
          <p className="text-gray-500 text-sm mt-1">
            共 {total} 筆刊登
          </p>
        </div>
        {/* 手機版篩選切換 */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          {showFilters ? '隱藏篩選' : '🔍 篩選'}
        </button>
      </div>

      <div className="flex gap-6">
        {/* 篩選面板 */}
        <aside className={`w-64 shrink-0 space-y-4 ${showFilters ? 'block' : 'hidden'} sm:block`}>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
            {/* 搜尋 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">搜尋</label>
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => updateFilter('keyword', e.target.value)}
                placeholder="輸入卡片名稱..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* 稀有度 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">稀有度</label>
              <select
                value={filters.rarity}
                onChange={(e) => updateFilter('rarity', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">全部</option>
                {RARITIES.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* 屬性 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">屬性</label>
              <select
                value={filters.card_type}
                onChange={(e) => updateFilter('card_type', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">全部</option>
                {CARD_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* 狀態 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">卡片狀態</label>
              <select
                value={filters.condition}
                onChange={(e) => updateFilter('condition', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">全部</option>
                {CONDITIONS.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* 價格範圍 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">價格範圍（港幣）</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={filters.price_min}
                  onChange={(e) => updateFilter('price_min', e.target.value)}
                  placeholder="最低"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  min="0"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  value={filters.price_max}
                  onChange={(e) => updateFilter('price_max', e.target.value)}
                  placeholder="最高"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  min="0"
                />
              </div>
            </div>

            {/* 排序 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
              <select
                value={`${filters.sort_by}-${filters.sort_order}`}
                onChange={(e) => {
                  const [sort_by, sort_order] = e.target.value.split('-')
                  setFilters(prev => ({ ...prev, sort_by, sort_order }))
                }}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="created_at-desc">最新刊登</option>
                <option value="created_at-asc">最舊刊登</option>
                <option value="price_hkd-asc">價格：低到高</option>
                <option value="price_hkd-desc">價格：高到低</option>
              </select>
            </div>

            {/* 重置 */}
            <button
              onClick={resetFilters}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              🔄 重置篩選
            </button>
          </div>
        </aside>

        {/* 卡片列表 */}
        <div className="flex-grow">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="loading-spinner w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">沒有找到卡片</h3>
              <p className="text-gray-500">嘗試調整篩選條件</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onClick={() => navigate(`/listing/${listing.id}`)}
                  />
                ))}
              </div>

              {/* 分頁 */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => updateFilter('page', filters.page - 1)}
                    disabled={filters.page <= 1}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← 上一頁
                  </button>
                  <span className="text-sm text-gray-500">
                    第 {filters.page} / {totalPages} 頁
                  </span>
                  <button
                    onClick={() => updateFilter('page', filters.page + 1)}
                    disabled={filters.page >= totalPages}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一頁 →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
