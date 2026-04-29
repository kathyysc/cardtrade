import { Link } from 'react-router-dom'

/**
 * 首頁 — 介紹 CardTrade 平台
 */
export default function LandingPage() {
  return (
    <div>
      {/* Hero 區域 */}
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              🃏 CardTrade
            </h1>
            <p className="text-xl sm:text-2xl mb-4 text-orange-100">
              寶可夢卡片二手交易平台
            </p>
            <p className="text-base sm:text-lg mb-10 text-orange-200">
              📸 AI 自動識別卡片 · 💰 自由定價 · 💬 WhatsApp 直接聯繫
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/browse"
                className="px-8 py-3 bg-white text-primary-600 font-bold rounded-xl hover:bg-orange-50 transition-colors text-lg shadow-lg"
              >
                📋 瀏覽卡牌
              </Link>
              <Link
                to="/register"
                className="px-8 py-3 bg-primary-800 text-white font-bold rounded-xl hover:bg-primary-900 transition-colors text-lg border border-primary-500"
              >
                🚀 免費註冊開始賣卡
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 特色介紹 */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* AI 識別 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI 智能識別</h3>
            <p className="text-gray-500">
              拍一張卡片照片，AI 自動填寫卡片名稱、稀有度、卡包和估計價格，省時省力。
            </p>
          </div>

          {/* 瀏覽搜尋 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">輕鬆搜尋</h3>
            <p className="text-gray-500">
              按名稱、稀有度、屬性、價格範圍搜尋，快速找到你想要的卡牌。
            </p>
          </div>

          {/* WhatsApp 聯繫 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">WhatsApp 交易</h3>
            <p className="text-gray-500">
              看到喜歡的卡牌？一鍵透過 WhatsApp 直接聯繫賣家，簡單快捷。
            </p>
          </div>
        </div>
      </section>

      {/* 使用流程 */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            如何使用？
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">1. 免費註冊</h4>
              <p className="text-sm text-gray-500">填寫基本資料，30秒完成註冊</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📸</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">2. AI 識別卡片</h4>
              <p className="text-sm text-gray-500">拍張照片，AI 自動填寫卡片資訊</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">3. 設定價格刊登</h4>
              <p className="text-sm text-gray-500">選擇卡況、定價、刊登出售</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">4. WhatsApp 成交</h4>
              <p className="text-sm text-gray-500">買家透過 WhatsApp 直接聯繫你</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          開始交易你的寶可夢卡片！
        </h2>
        <p className="text-gray-500 mb-8">
          已有眾多玩家在 CardTrade 交易卡牌，加入我們吧 🎉
        </p>
        <Link
          to="/register"
          className="inline-block px-8 py-3 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 transition-colors text-lg shadow-lg"
        >
          免費註冊
        </Link>
      </section>
    </div>
  )
}
