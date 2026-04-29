"""
資料庫連線設定
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# 從環境變數讀取資料庫網址，預設使用 SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cardtrade.db")

# 建立 SQLAlchemy 引擎
# SQLite 需要特殊處理：check_same_thread=False
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(DATABASE_URL, connect_args=connect_args)

# 建立 Session 類別
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 建立基礎模型類別
Base = declarative_base()


# 資料庫依賴注入：取得資料庫 session
def get_db():
    """FastAPI 依賴注入用的資料庫 session 產生器"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
