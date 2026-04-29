"""
CardTrade — 寶可夢卡片二手交易平台
FastAPI 主應用程式入口

啟動方式：
    uvicorn main:app --reload --host 0.0.0.0 --port 8000

API 文件：
    http://localhost:8000/docs（Swagger UI）
    http://localhost:8000/redoc（ReDoc）
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

# 載入環境變數
load_dotenv()

# 匯入資料庫和模型
from database import engine, Base
from models import User, Card, Listing  # noqa: F401 - 確保所有模型都被匯入
from seed_data import seed_database

# 匯入路由
from routers import auth, cards, upload, search

# ==================== 建立 FastAPI 應用 ====================

app = FastAPI(
    title="CardTrade — 寶可夢卡片交易平台",
    description="""
    ## CardTrade API

    寶可夢卡片二手交易平台的後端 API。

    ### 功能
    - 🔐 用戶註冊與登入（JWT 認證）
    - 🃏 卡片資料管理
    - 📸 AI 卡片圖片識別（Google Gemini）
    - 🛒 刊登管理（上架/下架）
    - 🔍 搜尋與篩選
    - 💬 WhatsApp 聯絡賣家
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ==================== CORS 設定 ====================

# 允許前端跨域請求
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # 允許所有 HTTP 方法
    allow_headers=["*"],  # 允許所有 HTTP 標頭
)

# ==================== 註冊路由 ====================

app.include_router(auth.router)
app.include_router(cards.router)
app.include_router(upload.router)
app.include_router(search.router)

# ==================== 靜態檔案（上傳的圖片）====================

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# ==================== 啟動事件 ====================

@app.on_event("startup")
def on_startup():
    """應用啟動時執行：建立資料表和種子資料"""
    print("🃏 CardTrade 正在啟動...")

    # 建立所有資料表
    Base.metadata.create_all(bind=engine)
    print("✅ 資料表建立完成")

    # 建立種子資料
    from database import SessionLocal
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

    print("🚀 CardTrade 啟動完成！")
    print(f"📡 API 文件：http://localhost:8000/docs")


# ==================== 首頁 ====================

@app.get("/", tags=["首頁"])
def root():
    """API 首頁，顯示基本資訊"""
    return {
        "name": "CardTrade",
        "description": "寶可夢卡片二手交易平台",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "ok",
    }


@app.get("/api/health", tags=["健康檢查"])
def health_check():
    """健康檢查端點"""
    return {"status": "ok", "service": "CardTrade API"}
