import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cardsAPI, listingsAPI, uploadAPI } from '../services/api'
import { useAuth } from '../services/AuthContext'
import AIRecognitionUpload from '../components/AIRecognitionUpload'
import { RARITIES, CONDITIONS, CARD_TYPES } from '../services/constants'

/**
 * 賣卡頁面 — 上傳照片 → AI 識別 → 確認刊登
 */
export default function SellPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // 步驟：1=上傳, 2=確認, 3=完成
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 卡片資料（AI 識別結果或手動輸入）
  const [cardData, setCardData] = useState({
    card_name: '',
    card_number: '',
    set_name: '',
    rarity: '',
    card_type: '',
    hp: '',
    estimated_price_hkd: '',
    description: '',
    imagePreview: null,
  })

  // 刊登資料
  const [listingData, setListingData] = useState({
    condition: 'Near Mint',
    price_hkd: '',
    quantity: 1,
    description: '',
  })

  // 手動模式切換
  const [manualMode, setManualMode] = useState(false)

  // AI 識別完成回調
  const handleAIResult = (result) => {
    setCardData({
      card_name: result.card_name || '',
      card_number: result.card_number || '',
      set_name: result.set_name || '',
      rarity: result.rarity || '',
      card_type: result.card_type || '',
      hp: result.hp?.toString() || '',
      estimated_price_hkd: result.estimated_price_hkd?.toString() || '',
      description: result.description || '',
      imagePreview: result.imagePreview || null,
    })
    // 如果 AI 有估價，自動填入刊登價格
    if (result.estimated_price_hkd) {
      setListingData(prev => ({ ...prev, price_hkd: result.estimated_price_hkd.toString() }))
    }
    setStep(2)
  }

  // 處理卡片資料變更
  const handleCardChange = (field, value) => {
    setCardData(prev => ({ ...prev, [field]: value }))
  }

  // 處理刊登資料變更
  const handleListingChange = (field, value) => {
    setListingData(prev => ({ ...prev, [field]: value }))
  }

  // 切換到手動模式
  const switchToManual = () => {
    setManualMode(true)
    setStep(2)
  }

  // 提交刊登
  const handleSubmit = async () => {
    setError('')

    // 驗證
    if (!cardData.card_name.trim()) {
      setError('請填寫卡片名稱')
      return
    }
    if (!listingData.price_hkd || parseFloat(listingData.price_hkd) <= 0) {
      setError('請填寫有效的售價')
      return
    }

    setLoading(true)
    try {
      // 第一步：建立卡片
      const cardRes = await cardsAPI.create({
        card_name: cardData.card_name,
        card_number: cardData.card_number || null,
        set_name: cardData.set_name || null,
        rarity: cardData.rarity || null,
        card_type: cardData.card_type || null,
        hp: cardData.hp ? parseInt(cardData.hp) : null,
        description: cardData.description || null,
        estimated_price_hkd: cardData.estimated_price_hkd ? parseFloat(cardData.estimated_price_hkd) : null,
      })

      // 第二步：建立刊登
      await listingsAPI.create({
        card_id: cardRes.data.id,
        condition: listingData.condition,
        price_hkd: parseFloat(listingData.price_hkd),
        quantity: parseInt(listingData.quantity) || 1,
        description: listingData.description || null,
      })

      setStep(3)
    } catch (err) {
      const msg = err.response?.data?.detail || '刊登失敗，請稍後再試'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // ==================== 渲染 ====================

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">💰 賣卡</h1>
      <p className="text-gray-500 mb-8">上傳卡片照片，AI 自動識別並刊登出售</p>

      {/* 步驟指示器 */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[
          { num: 1, label: '拍照識別' },
          { num: 2, label: '確認資料' },
          { num: 3, label: '完成刊登' },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= s.num ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > s.num ? '✓' : s.num}
            </div>
            <span className={`text-sm ${step >= s.num ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
              {s.label}
            </span>
            {i < 2 && <div className={`w-12 h-0.5 ${step > s.num ? 'bg-primary-500' : 'bg-gray-200'}`}></div>}
          </div>
        ))}
      </div>

      {/* 錯誤訊息 */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 mb-4">
          ⚠️ {error}
        </div>
      )}

      {/* 步驟 1：上傳照片 */}
      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <AIRecognitionUpload onResult={handleAIResult} />

          {/* 分隔線 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-400">或者</span>
            </div>
          </div>

          {/* 手動輸入 */}
          <button
            onClick={switchToManual}
            className="w-full py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            ✏️ 手動填寫卡片資料
          </button>
        </div>
      )}

      {/* 步驟 2：確認資料 */}
      {step === 2 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          {/* 預覽 */}
          {cardData.imagePreview && (
            <div className="flex justify-center">
              <img src={cardData.imagePreview} alt="卡片預覽" className="max-w-xs rounded-xl shadow-md" />
            </div>
          )}

          {/* 卡片資料 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">🃏 卡片資料</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 卡片名稱 */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  卡片名稱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cardData.card_name}
                  onChange={(e) => handleCardChange('card_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="例如：皮卡丘 VMAX / Pikachu VMAX"
                />
              </div>

              {/* 卡片編號 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">卡片編號</label>
                <input
                  type="text"
                  value={cardData.card_number}
                  onChange={(e) => handleCardChange('card_number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="例如：044/185"
                />
              </div>

              {/* 卡包名稱 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">卡包名稱</label>
                <input
                  type="text"
                  value={cardData.set_name}
                  onChange={(e) => handleCardChange('set_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="例如：Vivid Voltage"
                />
              </div>

              {/* 稀有度 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">稀有度</label>
                <select
                  value={cardData.rarity}
                  onChange={(e) => handleCardChange('rarity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="">選擇稀有度</option>
                  {RARITIES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              {/* 屬性 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">屬性/類型</label>
                <select
                  value={cardData.card_type}
                  onChange={(e) => handleCardChange('card_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="">選擇屬性</option>
                  {CARD_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* HP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HP</label>
                <input
                  type="number"
                  value={cardData.hp}
                  onChange={(e) => handleCardChange('hp', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="例如：310"
                />
              </div>

              {/* 估計價格 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">AI 估價（港幣）</label>
                <input
                  type="number"
                  value={cardData.estimated_price_hkd}
                  onChange={(e) => handleCardChange('estimated_price_hkd', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="例如：280"
                  step="0.01"
                />
                <p className="text-xs text-gray-400 mt-1">此為 AI 估算的參考價格</p>
              </div>

              {/* 描述 */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">卡片描述</label>
                <textarea
                  value={cardData.description}
                  onChange={(e) => handleCardChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  rows="2"
                  placeholder="簡短描述這張卡片"
                ></textarea>
              </div>
            </div>
          </div>

          {/* 刊登資料 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">📦 刊登資料</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 卡片狀態 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">卡片狀態</label>
                <select
                  value={listingData.condition}
                  onChange={(e) => handleListingChange('condition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  {CONDITIONS.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* 售價 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  售價（港幣）<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={listingData.price_hkd}
                  onChange={(e) => handleListingChange('price_hkd', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>

              {/* 數量 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">數量</label>
                <input
                  type="number"
                  value={listingData.quantity}
                  onChange={(e) => handleListingChange('quantity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  min="1"
                />
              </div>

              {/* 賣家備註 */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">賣家備註</label>
                <textarea
                  value={listingData.description}
                  onChange={(e) => handleListingChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  rows="2"
                  placeholder="例如：有卡套、已驗真、可面交等"
                ></textarea>
              </div>
            </div>
          </div>

          {/* 操作按鈕 */}
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← 返回
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-grow py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                  刊登中...
                </span>
              ) : (
                '✅ 確認刊登'
              )}
            </button>
          </div>
        </div>
      )}

      {/* 步驟 3：完成 */}
      {step === 3 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">刊登成功！</h2>
          <p className="text-gray-500 mb-2">
            你的「{cardData.card_name}」已成功刊登
          </p>
          <p className="text-sm text-gray-400 mb-8">
            買家會透過 WhatsApp 聯繫你（請確保已設定 WhatsApp 號碼）
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setStep(1)
                setCardData({ card_name: '', card_number: '', set_name: '', rarity: '', card_type: '', hp: '', estimated_price_hkd: '', description: '', imagePreview: null })
                setListingData({ condition: 'Near Mint', price_hkd: '', quantity: 1, description: '' })
                setManualMode(false)
              }}
              className="px-6 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              繼續刊登
            </button>
            <button
              onClick={() => navigate('/my-listings')}
              className="px-6 py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
            >
              查看我的刊登
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
