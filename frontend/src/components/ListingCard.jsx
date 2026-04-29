import { RARITIES, CONDITIONS, CARD_TYPES, getRarityClass, getConditionClass, getCardTypeClass, formatPrice, formatDate } from '../services/constants'

/**
 * 卡片刊登卡片元件 — 顯示在瀏覽頁面的卡片列表中
 *
 * @param {object} listing - 刊登資料（包含 card 和 seller）
 * @param {function} onClick - 點擊卡片時的回調函數
 */
export default function ListingCard({ listing, onClick }) {
  const { card, seller } = listing

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden card-hover cursor-pointer"
    >
      {/* 卡片圖片區域 */}
      <div className="relative bg-gradient-to-br from-primary-50 to-blue-50 h-48 flex items-center justify-center">
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={card?.card_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-2">
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
            <p className="text-xs text-gray-400 px-4 truncate">{card?.set_name}</p>
          </div>
        )}

        {/* 稀有度標籤 */}
        {card?.rarity && (
          <span className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold rounded-full ${getRarityClass(card.rarity)} bg-white/80 backdrop-blur-sm`}>
            {card.rarity}
          </span>
        )}

        {/* 狀態標籤 */}
        <span className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded-full ${getConditionClass(listing.condition)}`}>
          {listing.condition === 'Near Mint' ? 'NM' :
           listing.condition === 'Lightly Played' ? 'LP' :
           listing.condition === 'Moderately Played' ? 'MP' :
           listing.condition === 'Heavily Played' ? 'HP' : 'D'}
        </span>
      </div>

      {/* 卡片資訊 */}
      <div className="p-4">
        {/* 卡片名稱 */}
        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-1">
          {card?.card_name || '未知卡片'}
        </h3>

        {/* 卡包名稱 */}
        <p className="text-xs text-gray-400 mb-2 truncate">
          {card?.set_name || '未知卡包'}
          {card?.card_number && ` · ${card.card_number}`}
        </p>

        {/* 屬性標籤 */}
        {card?.card_type && (
          <span className={`inline-block px-2 py-0.5 text-xs rounded-full mb-2 ${getCardTypeClass(card.card_type)}`}>
            {card.card_type}
          </span>
        )}

        {/* 價格和數量 */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(listing.price_hkd)}
          </span>
          {listing.quantity > 1 && (
            <span className="text-xs text-gray-400">
              數量：{listing.quantity}
            </span>
          )}
        </div>

        {/* 賣家資訊 */}
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
          <span>👤</span>
          <span>{seller?.display_name || seller?.username || '匿名賣家'}</span>
        </div>
      </div>
    </div>
  )
}
