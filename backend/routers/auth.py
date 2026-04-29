"""
用戶認證路由
處理註冊、登入、取得用戶資訊
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os

from database import get_db
from models import User
from schemas import UserRegister, UserLogin, UserResponse, TokenResponse

router = APIRouter(prefix="/api/auth", tags=["認證"])

# 密碼加密設定
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT 設定
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 天

# Bearer Token 驗證器
security = HTTPBearer()


def hash_password(password: str) -> str:
    """加密密碼"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """驗證密碼"""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """建立 JWT Token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """從 JWT Token 取得當前用戶（依賴注入用）"""
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="無效的認證憑證",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except (JWTError, ValueError):
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user


# ==================== API 路由 ====================

@router.post("/register", response_model=TokenResponse, summary="用戶註冊")
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    註冊新用戶

    - **username**: 用戶名（至少 3 個字元）
    - **email**: 電郵地址
    - **password**: 密碼（至少 6 個字元）
    - **whatsapp**: WhatsApp 號碼（可選，格式：+85212345678）
    """
    # 檢查用戶名是否已存在
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="此用戶名已被使用")

    # 檢查電郵是否已存在
    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="此電郵已被註冊")

    # 建立新用戶
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        whatsapp=user_data.whatsapp,
        display_name=user_data.display_name or user_data.username,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 建立 JWT Token
    token = create_access_token(data={"sub": str(new_user.id)})

    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(new_user)
    )


@router.post("/login", response_model=TokenResponse, summary="用戶登入")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """
    用戶登入，返回 JWT Token

    - **username**: 用戶名
    - **password**: 密碼
    """
    # 查找用戶
    user = db.query(User).filter(User.username == user_data.username).first()
    if not user:
        raise HTTPException(status_code=401, detail="用戶名或密碼錯誤")

    # 驗證密碼
    if not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="用戶名或密碼錯誤")

    # 檢查帳號是否啟用
    if not user.is_active:
        raise HTTPException(status_code=403, detail="此帳號已被停用")

    # 建立 JWT Token
    token = create_access_token(data={"sub": str(user.id)})

    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user)
    )


@router.get("/me", response_model=UserResponse, summary="取得當前用戶資訊")
def get_me(current_user: User = Depends(get_current_user)):
    """取得當前登入用戶的資訊"""
    return UserResponse.model_validate(current_user)


@router.put("/me", response_model=UserResponse, summary="更新用戶資訊")
def update_me(
    whatsapp: str = None,
    display_name: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新當前用戶的個人資訊"""
    if whatsapp is not None:
        current_user.whatsapp = whatsapp
    if display_name is not None:
        current_user.display_name = display_name

    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)
