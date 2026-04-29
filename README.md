# 🃏 CardTrade — 寶可夢卡片二手交易平台

> AI 智能識別 · 快速刊登 · WhatsApp 交易

![Python](https://img.shields.io/badge/Python-3.11+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)
![React](https://img.shields.io/badge/React-18-61dafb)
![Vite](https://img.shields.io/badge/Vite-6.0-646cff)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 功能特色

- 🤖 **AI 智能識別** — 拍一張卡片照片，自動填寫卡片名稱、稀有度、卡包、估價
- 📋 **瀏覽搜尋** — 按名稱、稀有度、屬性、價格範圍搜尋卡牌
- 💰 **刊登賣卡** — 設定價格、狀態、數量，輕鬆上架
- 💬 **WhatsApp 交易** — 買家一鍵 WhatsApp 聯繫賣家
- 📱 **手機適配** — 響應式設計，手機也能輕鬆使用
- 🔐 **用戶認證** — 註冊、登入、JWT 認證

## 🛠 技術架構

| 項目 | 技術 |
|------|------|
| 前端 | React 18 + Vite + Tailwind CSS |
| 後端 | Python FastAPI |
| 資料庫 | SQLite（可升級 PostgreSQL） |
| AI 識別 | Google Gemini API（免費） |
| 認證 | JWT (JSON Web Token) |

---

## 🚀 快速開始

### 前置需求

- [Node.js](https://nodejs.org/) 18+ （前端）
- [Python](https://www.python.org/) 3.11+ （後端）
- [Google Gemini API Key](https://aistudio.google.com/apikey)（免費申請，用於 AI 識別）

### 第一步：下載專案

```bash
# 進入專案目錄
cd cardtrade
```

### 第二步：設定後端

```bash
# 1. 進入後端目錄
cd backend

# 2. 建立虛擬環境（建議）
python -m venv venv

# 3. 啟動虛擬環境
# macOS / Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 4. 安裝 Python 套件
pip install -r requirements.txt

# 5. 複製環境變數檔案
cp ../.env.example .env

# 6. 編輯 .env 檔案，填入你的 API Key
# 用 VS Code 打開：
code .env
```

**必填設定：**

```env
# 1. Google Gemini API Key（免費申請：https://aistudio.google.com/apikey）
GEMINI_API_KEY=你的API Key

# 2. JWT 密鑰（用以下指令生成一個隨機的）
# 在終端執行：python -c "import secrets; print(secrets.token_hex(32))"
JWT_SECRET_KEY=你生成的密鑰
```

### 第三步：啟動後端

```bash
# 確保你在 backend 目錄，且虛擬環境已啟動
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

看到以下訊息表示成功：
```
🃏 CardTrade 正在啟動...
✅ 資料表建立完成
🚀 CardTrade 啟動完成！
📡 API 文件：http://localhost:8000/docs
```

### 第四步：設定並啟動前端

```bash
# 打開新的終端視窗

# 1. 進入前端目錄
cd cardtrade/frontend

# 2. 安裝 Node.js 套件
npm install

# 3. 啟動開發伺服器
npm run dev
```

看到以下訊息表示成功：
```
VITE v6.0.3 ready in 300ms
➜ Local: http://localhost:5173/
```

### 第五步：開始使用！

1. 打開瀏覽器，前往 **http://localhost:5173**
2. 點擊「免費註冊」建立帳號
3. 或使用測試帳號登入：
   - 用戶名：`kathy`
   - 密碼：`password123`
4. 嘗試「賣卡」功能，上傳卡片照片讓 AI 識別！

---

## 📁 專案結構

```
cardtrade/
├── backend/                  # 後端（Python FastAPI）
│   ├── main.py              # 應用程式入口
│   ├── database.py          # 資料庫連線設定
│   ├── models.py            # 資料庫模型（卡片、刊登、用戶）
│   ├── schemas.py           # API 資料格式定義
│   ├── seed_data.py         # 測試用種子資料
│   ├── requirements.txt     # Python 依賴套件
│   ├── routers/             # API 路由
│   │   ├── auth.py          # 註冊、登入、認證
│   │   ├── cards.py         # 卡片 CRUD
│   │   ├── upload.py        # 圖片上傳 + AI 識別
│   │   └── search.py        # 刊登管理 + 搜尋
│   └── services/            # 業務邏輯
│       └── gemini_service.py # Google Gemini AI 識別
│
├── frontend/                 # 前端（React + Vite）
│   ├── src/
│   │   ├── App.jsx          # 路由設定
│   │   ├── main.jsx         # 程式入口
│   │   ├── index.css        # 全域樣式
│   │   ├── components/      # 可重用元件
│   │   │   ├── Navbar.jsx   # 導航列
│   │   │   ├── Footer.jsx   # 頁尾
│   │   │   ├── ListingCard.jsx    # 卡片列表項目
│   │   │   └── AIRecognitionUpload.jsx # AI 識別上傳
│   │   ├── pages/           # 頁面元件
│   │   │   ├── LandingPage.jsx     # 首頁
│   │   │   ├── LoginPage.jsx       # 登入頁
│   │   │   ├── RegisterPage.jsx    # 註冊頁
│   │   │   ├── DashboardPage.jsx   # 儀表板
│   │   │   ├── SellPage.jsx        # 賣卡頁
│   │   │   ├── BrowsePage.jsx      # 瀏覽搜尋頁
│   │   │   ├── ListingDetailPage.jsx # 刊登詳情頁
│   │   │   └── MyListingsPage.jsx  # 我的刊登管理
│   │   └── services/        # API 服務
│   │       ├── api.js       # HTTP 請求客戶端
│   │       ├── AuthContext.jsx # 認證上下文
│   │       └── constants.js # 常數定義
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── .env.example              # 環境變數模板
├── docker-compose.yml        # Docker 部署設定
├── .gitignore
└── README.md                 # 這個檔案
```

---

## 🐳 Docker 部署（可選）

如果你熟悉 Docker，可以用 Docker 一鍵部署：

```bash
# 1. 設定環境變數
cp .env.example .env
# 編輯 .env 填入 API Key

# 2. 一鍵啟動
docker-compose up --build

# 3. 訪問
# 前端：http://localhost:5173
# 後端 API：http://localhost:8000/docs
```

---

## 🔧 API 文件

後端啟動後，可以訪問互動式 API 文件：

- **Swagger UI**：http://localhost:8000/docs
- **ReDoc**：http://localhost:8000/redoc

---

## 📸 AI 識別使用說明

1. 登入後，點擊「賣卡」
2. 拍攝或上傳寶可夢卡片照片
3. 點擊「AI 自動識別卡片」
4. AI 會自動填寫：卡片名稱、稀有度、卡包、估價
5. 確認或修改資料後，設定售價和卡況
6. 點擊「確認刊登」完成上架

> 💡 提示：拍照時確保卡片清晰、光線充足，能提高識別準確度

---

## 🧪 測試帳號

系統預設有三個測試帳號（種子資料）：

| 用戶名 | 密碼 | WhatsApp | 顯示名稱 |
|--------|------|----------|----------|
| `kathy` | `password123` | +85263388538 | Kathy |
| `pokemon_master` | `password123` | +85291234567 | 小智 |
| `card_collector` | `password123` | +85298765432 | 小霞 |

預設有 12 張卡片和 12 筆刊登可供測試。

---

## 💰 卡片稀有度說明

| 稀有度 | 說明 |
|--------|------|
| Common | 普通卡（C） |
| Uncommon | 非普通卡（U） |
| Rare | 稀有卡（R） |
| Holo Rare | 全息稀有卡（HR） |
| Ultra Rare | 超稀有卡（UR） |
| Secret Rare | 秘密稀有卡（SR） |
| Special Illustration Rare | 特別插畫稀有（SAR） |
| Gold Rare | 金閃稀有（GR） |
| Alt Art | 替代插畫（AA） |

## 📦 卡片狀態說明

| 縮寫 | 英文 | 說明 |
|------|------|------|
| NM | Near Mint | 近未使用，幾乎全新 |
| LP | Lightly Played | 輕微使用痕跡 |
| MP | Moderately Played | 中度使用 |
| HP | Heavily Played | 重度使用 |
| D | Damaged | 損壞 |

---

## ❓ 常見問題

### Q: AI 識別準確嗎？
A: Gemini API 對常見卡片的識別率很高，但罕見或特殊版卡可能需要手動修正。識別結果僅供參考，刊登前請自行確認。

### Q: 忘記設定 Gemini API Key？
A: 不設定也可以使用平台，只是無法使用 AI 識別功能。你可以手動填寫卡片資料來刊登。

### Q: 如何升級到 PostgreSQL？
A: 修改 `.env` 中的 `DATABASE_URL` 為 PostgreSQL 連線字串即可，SQLAlchemy 會自動適配。

### Q: 為什麼買家聯繫不到賣家？
A: 賣家需要在個人資料中設定 WhatsApp 號碼（格式：+85212345678）。

---

## 📄 授權

MIT License — 歡迎自由使用和修改。
