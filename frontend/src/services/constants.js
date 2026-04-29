/**
 * 常數定義 — 卡片稀有度、狀態、屬性等
 */

// 卡片稀有度選項
export const RARITIES = [
  { value: 'Common', label: 'Common（普通）', class: 'rarity-common' },
  { value: 'Uncommon', label: 'Uncommon（非普通）', class: 'rarity-uncommon' },
  { value: 'Rare', label: 'Rare（稀有）', class: 'rarity-rare' },
  { value: 'Holo Rare', label: 'Holo Rare（全息稀有）', class: 'rarity-holo-rare' },
  { value: 'Ultra Rare', label: 'Ultra Rare（超稀有）', class: 'rarity-ultra-rare' },
  { value: 'Secret Rare', label: 'Secret Rare（秘密稀有）', class: 'rarity-secret-rare' },
  { value: 'Special Illustration Rare', label: 'Special Illustration（特別插畫）', class: 'rarity-special-illustration-rare' },
  { value: 'Gold Rare', label: 'Gold Rare（金閃稀有）', class: 'rarity-gold-rare' },
  { value: 'Alt Art', label: 'Alt Art（替代插畫）', class: 'rarity-alt-art' },
]

// 卡片狀態選項
export const CONDITIONS = [
  { value: 'Near Mint', label: 'NM（近未使用）', class: 'condition-nm' },
  { value: 'Lightly Played', label: 'LP（輕微使用）', class: 'condition-lp' },
  { value: 'Moderately Played', label: 'MP（中度使用）', class: 'condition-mp' },
  { value: 'Heavily Played', label: 'HP（重度使用）', class: 'condition-hp' },
  { value: 'Damaged', label: 'D（損壞）', class: 'condition-d' },
]

// 卡片屬性選項
export const CARD_TYPES = [
  { value: '草', label: '🌿 草', color: 'bg-green-100 text-green-800' },
  { value: '火', label: '🔥 火', color: 'bg-red-100 text-red-800' },
  { value: '水', label: '💧 水', color: 'bg-blue-100 text-blue-800' },
  { value: '雷', label: '⚡ 雷', color: 'bg-yellow-100 text-yellow-800' },
  { value: '超能力', label: '🔮 超能力', color: 'bg-purple-100 text-purple-800' },
  { value: '格鬥', label: '👊 格鬥', color: 'bg-orange-100 text-orange-800' },
  { value: '惡', label: '🌑 惡', color: 'bg-gray-800 text-gray-100' },
  { value: '鋼', label: '⚙️ 鋼', color: 'bg-slate-200 text-slate-800' },
  { value: '妖精', label: '🧚 妖精', color: 'bg-pink-100 text-pink-800' },
  { value: '龍', label: '🐉 龍', color: 'bg-indigo-100 text-indigo-800' },
  { value: '無色', label: '⚪ 無色', color: 'bg-gray-100 text-gray-800' },
  { value: '訓練家卡', label: '🃏 訓練家卡', color: 'bg-amber-100 text-amber-800' },
  { value: '能量卡', label: '⚡ 能量卡', color: 'bg-cyan-100 text-cyan-800' },
]

/**
 * 根據稀有度值取得對應的 CSS class
 */
export function getRarityClass(rarity) {
  const found = RARITIES.find(r => r.value === rarity)
  return found ? found.class : 'text-gray-600'
}

/**
 * 根據狀態值取得對應的 CSS class
 */
export function getConditionClass(condition) {
  const found = CONDITIONS.find(c => c.value === condition)
  return found ? found.class : 'bg-gray-100 text-gray-800'
}

/**
 * 根據屬性值取得對應的 CSS class
 */
export function getCardTypeClass(type) {
  const found = CARD_TYPES.find(t => t.value === type)
  return found ? found.color : 'bg-gray-100 text-gray-800'
}

/**
 * 格式化價格
 */
export function formatPrice(price) {
  if (price === null || price === undefined) return '未定價'
  return `HK$ ${Number(price).toLocaleString('zh-HK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

/**
 * 格式化日期
 */
export function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
