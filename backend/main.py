"""
CardTrade — 寶可夢卡片二手交易平台
FastAPI 主應用程式入口

啟動方式：
    python3 main.py
    或
    uvicorn main:app --reload --host 0.0.0.0 --port 8000

API 文件：
    http://localhost:8000/docs（Swagger UI）
    http://localhost:8000/redoc（ReDoc）
"""
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

# 載入環境變數
load_dotenv()

# Debug：顯示 API Key 狀態
_or_key = os.getenv("OPENROUTER_API_KEY", "").strip()
if _or_key:
    print(f"✅ OPENROUTER_API_KEY 已設定（長度：{len(_or_key)}）")
else:
    print("⚠️ OPENROUTER_API_KEY 未設定！AI 識別將不可用")
    print("   免費申請：https://openrouter.ai/keys")

# 匯入資料庫和模型
from database import engine, Base
from models import User, Card, Listing  # noqa: F401
from seed_data import seed_database

# 匯入路由
from routers import auth, cards, upload, search

# ==================== 啟動事件 ====================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """應用啟動和關閉時執行"""
    print("🃏 CardTrade 正在啟動...")
    Base.metadata.create_all(bind=engine)
    print("✅ 資料表建立完成")
    from database import SessionLocal
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    print("🚀 CardTrade 啟動完成！")
    print("📡 API 文件：http://localhost:8000/docs")
    yield
    print("👋 CardTrade 已關閉")

# ==================== 建立 FastAPI 應用 ====================

app = FastAPI(
    title="CardTrade — 寶可夢卡片交易平台",
    description="""
    ## CardTrade API
    寶可夢卡片二手交易平台的後端 API。
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ==================== CORS 設定 ====================

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
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== 註冊路由 ====================

app.include_router(auth.router)
app.include_router(cards.router)
app.include_router(upload.router)
app.include_router(search.router)

# ==================== 靜態檔案 ====================

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# ==================== 首頁 ====================

@app.get("/", tags=["首頁"])
def root():
    return {
        "name": "CardTrade",
        "description": "寶可夢卡片二手交易平台",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "ok",
    }

@app.get("/api/health", tags=["健康檢查"])
def health_check():
    return {"status": "ok", "service": "CardTrade API"}


# ==================== 直接執行 ====================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
