import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { listingsAPI } from '../services/api'
import { getRarityClass, getConditionClass, getCardTypeClass, formatPrice, formatDate } from '../services/constants'

/**
 * 刊登詳情頁面 — 顯示單個刊登的完整資訊和 WhatsApp 聯繫按鈕
 */
export default function ListingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadListing()
  }, [id])

  const loadListing = async () => {
    setLoading(true)
    try {
      const response = await listingsAPI.get(id)
      setListing(response.data)
    } catch (err) {
      setError('找不到此刊登，可能已被刪除')
    } finally {
      setLoading(false)
    }
  }

  // 生成 WhatsApp 聯繫網址
  const getWhatsAppUrl = () => {
    const phone = listing?.seller?.whatsapp
    if (!phone) return null

    // 移除 + 號和空格
    const cleanPhone = phone.replace(/[\s+]/g, '')

    // 建立預設訊息
    const message = encodeURIComponent(
      `你好！我在 CardTrade 看到你刊登的「${listing?.card?.card_name}」` +
      `\n稀有度：${listing?.card?.rarity || '未知'}` +
      `\n狀態：${listing?.condition}` +
      `\n售價：${formatPrice(listing?.price_hkd)}` +
      `\n\n請問這張還在嗎？`
    )

    return `https://wa.me/${cleanPhone}?text=${message}`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="loading-spinner w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">😔</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{error || '找不到刊登'}</h2>
        <p className="text-gray-500 mb-6">此刊登可能已被賣家移除</p>
        <button
          onClick={() => navigate('/browse')}
          className="px-6 py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
        >
          返回瀏覽
        </button>
      </div>
    )
  }

  const { card, seller } = listing

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 返回按鈕 */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-flex items-center gap-1"
      >
        ← 返回
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左側：卡片圖片 */}
        <div>
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl overflow-hidden aspect-[3/4] flex items-center justify-center">
            {listing.image_url ? (
              <img
                src={listing.image_url}
                alt={card?.card_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-8">
                <div className="text-8xl mb-4">
                  {card?.card_type === '火' ? '🔥' :
                   card?.card_type === '水' ? '💧' :
                   card?.card_type === '草' ? '🌿' :
                   card?.card_type === '雷' ? '⚡' :
                   card?.card_type === '超能力' ? '🔮' :
                   card?.card_type === '格鬥' ? '👊' :
                   card?.card_type === '龍' ? '🐉' :
                   card?.card_type === '惡' ? '🌑' :
                   card?.card_type === '鋼' ? '⚙️' :
                   card?.card_type === '妖精' ? '🧚' : '🃏'}
                </div>
                <p className="text-gray-400">暫無圖片</p>
              </div>
            )}
          </div>
        </div>

        {/* 右側：卡片資訊 */}
        <div className="space-y-6">
          {/* 卡片名稱和標籤 */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {card?.card_name || '未知卡片'}
            </h1>
            <div className="flex flex-wrap gap-2">
              {card?.rarity && (
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRarityClass(card.rarity)} bg-gray-50`}>
                  {card.rarity}
                </span>
              )}
              {card?.card_type && (
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCardTypeClass(card.card_type)}`}>
                  {card.card_type}
                </span>
              )}
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getConditionClass(listing.condition)}`}>
                {listing.condition}
              </span>
            </div>
          </div>

          {/* 價格 */}
          <div className="bg-primary-50 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">售價</p>
            <p className="text-3xl font-bold text-primary-600">
              {formatPrice(listing.price_hkd)}
            </p>
            {card?.estimated_price_hkd && (
              <p className="text-sm text-gray-400 mt-1">
                AI 參考價：{formatPrice(card.estimated_price_hkd)}
              </p>
            )}
          </div>

          {/* 詳細資訊 */}
          <div className="space-y-3">
            {card?.set_name && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">卡包</span>
                <span className="text-gray-900 font-medium">{card.set_name}</span>
              </div>
            )}
            {card?.card_number && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">編號</span>
                <span className="text-gray-900 font-medium">{card.card_number}</span>
              </div>
            )}
            {card?.hp && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">HP</span>
                <span className="text-gray-900 font-medium">{card.hp}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">數量</span>
              <span className="text-gray-900 font-medium">{listing.quantity} 張</span>
            </div>
            {listing.created_at && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">刊登日期</span>
                <span className="text-gray-900 font-medium">{formatDate(listing.created_at)}</span>
              </div>
            )}
          </div>

          {/* 描述 */}
          {card?.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">卡片描述</h3>
              <p className="text-sm text-gray-600">{card.description}</p>
            </div>
          )}

          {/* 賣家備註 */}
          {listing.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">賣家備註</h3>
              <p className="text-sm text-gray-600">{listing.description}</p>
            </div>
          )}

          {/* 賣家資訊 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">賣家</p>
            <p className="font-medium text-gray-900">
              👤 {seller?.display_name || seller?.username || '匿名賣家'}
            </p>
          </div>

          {/* WhatsApp 聯繫按鈕 */}
          {getWhatsAppUrl() ? (
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-green-500 text-white text-center font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg"
            >
              💬 透過 WhatsApp 聯繫賣家
            </a>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700 text-center">
              ⚠️ 賣家尚未設定 WhatsApp 號碼，暫時無法聯繫
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
