"""
Pydantic 資料驗證模型（Schemas）
定義 API 請求和回應的資料結構
"""
from pydantic import BaseModel, Field
from pydantic import EmailStr  # 需要 email-validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


# ==================== 列舉類型（與 models.py 對應）====================

class CardRarity(str, Enum):
    COMMON = "Common"
    UNCOMMON = "Uncommon"
    RARE = "Rare"
    HOLO_RARE = "Holo Rare"
    ULTRA_RARE = "Ultra Rare"
    SECRET_RARE = "Secret Rare"
    SPECIAL_ILLUSTRATION_RARE = "Special Illustration Rare"
    GOLD_RARE = "Gold Rare"
    ALT_ART = "Alt Art"


class CardCondition(str, Enum):
    NEAR_MINT = "Near Mint"
    LIGHTLY_PLAYED = "Lightly Played"
    MODERATELY_PLAYED = "Moderately Played"
    HEAVILY_PLAYED = "Heavily Played"
    DAMAGED = "Damaged"


class CardType(str, Enum):
    GRASS = "草"
    FIRE = "火"
    WATER = "水"
    LIGHTNING = "雷"
    PSYCHIC = "超能力"
    FIGHTING = "格鬥"
    DARKNESS = "惡"
    METAL = "鋼"
    FAIRY = "妖精"
    DRAGON = "龍"
    COLORLESS = "無色"
    TRAINER = "訓練家卡"
    ENERGY = "能量卡"
    OTHER = "其他"


# ==================== 用戶相關 ====================

class UserRegister(BaseModel):
    """用戶註冊"""
    username: str = Field(..., min_length=3, max_length=50, description="用戶名")
    email: EmailStr = Field(..., description="電郵")
    password: str = Field(..., min_length=6, max_length=100, description="密碼（至少6位）")
    whatsapp: Optional[str] = Field(None, description="WhatsApp 號碼（格式：+85212345678）")
    display_name: Optional[str] = Field(None, max_length=100, description="顯示名稱")


class UserLogin(BaseModel):
    """用戶登入"""
    username: str = Field(..., description="用戶名")
    password: str = Field(..., description="密碼")


class UserResponse(BaseModel):
    """用戶資訊回應"""
    id: int
    username: str
    email: str
    whatsapp: Optional[str] = None
    display_name: Optional[str] = None
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """JWT Token 回應"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ==================== 卡片相關 ====================

class CardCreate(BaseModel):
    """建立卡片"""
    card_name: str = Field(..., max_length=200, description="卡片名稱")
    card_number: Optional[str] = Field(None, max_length=20, description="卡片編號")
    set_name: Optional[str] = Field(None, max_length=200, description="卡包名稱")
    rarity: Optional[CardRarity] = Field(None, description="稀有度")
    card_type: Optional[CardType] = Field(None, description="屬性/類型")
    hp: Optional[int] = Field(None, ge=0, description="HP 值")
    description: Optional[str] = Field(None, description="卡片描述")
    estimated_price_hkd: Optional[float] = Field(None, ge=0, description="估計價格（港幣）")
    image_url: Optional[str] = Field(None, description="卡片圖片網址")


class CardUpdate(BaseModel):
    """更新卡片"""
    card_name: Optional[str] = Field(None, max_length=200)
    card_number: Optional[str] = Field(None, max_length=20)
    set_name: Optional[str] = Field(None, max_length=200)
    rarity: Optional[CardRarity] = None
    card_type: Optional[CardType] = None
    hp: Optional[int] = Field(None, ge=0)
    description: Optional[str] = None
    estimated_price_hkd: Optional[float] = Field(None, ge=0)
    image_url: Optional[str] = None


class CardResponse(BaseModel):
    """卡片資訊回應"""
    id: int
    card_name: str
    card_number: Optional[str] = None
    set_name: Optional[str] = None
    rarity: Optional[CardRarity] = None
    card_type: Optional[CardType] = None
    hp: Optional[int] = None
    description: Optional[str] = None
    estimated_price_hkd: Optional[float] = None
    image_url: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ==================== AI 識別回應 ====================

class AIRecognitionResult(BaseModel):
    """AI 卡片識別結果"""
    card_name: str = Field(..., description="卡片名稱")
    card_number: Optional[str] = Field(None, description="卡片編號")
    set_name: Optional[str] = Field(None, description="卡包名稱")
    rarity: Optional[str] = Field(None, description="稀有度")
    card_type: Optional[str] = Field(None, description="屬性/類型")
    hp: Optional[int] = Field(None, description="HP 值")
    estimated_price_hkd: Optional[float] = Field(None, description="估計價格（港幣）")
    description: Optional[str] = Field(None, description="卡片描述")
    confidence: Optional[float] = Field(None, description="識別信心度（0-1）")


# ==================== 刊登相關 ====================

class ListingCreate(BaseModel):
    """建立刊登"""
    card_id: int = Field(..., description="卡片 ID")
    condition: CardCondition = Field(..., description="卡片狀態")
    price_hkd: float = Field(..., gt=0, description="售價（港幣）")
    quantity: int = Field(1, ge=1, description="數量")
    description: Optional[str] = Field(None, description="賣家備註")
    image_url: Optional[str] = Field(None, description="實物照片網址")


class ListingUpdate(BaseModel):
    """更新刊登"""
    condition: Optional[CardCondition] = None
    price_hkd: Optional[float] = Field(None, gt=0)
    quantity: Optional[int] = Field(None, ge=1)
    description: Optional[str] = None
    status: Optional[str] = None


class ListingResponse(BaseModel):
    """刊登資訊回應"""
    id: int
    seller_id: int
    card_id: int
    condition: CardCondition
    price_hkd: float
    quantity: int
    description: Optional[str] = None
    status: str
    image_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    # 包含關聯資料
    card: Optional[CardResponse] = None
    seller: Optional[UserResponse] = None

    class Config:
        from_attributes = True


# ==================== 搜尋相關 ====================

class SearchParams(BaseModel):
    """搜尋參數"""
    keyword: Optional[str] = Field(None, description="搜尋關鍵字（卡片名稱）")
    rarity: Optional[List[CardRarity]] = Field(None, description="稀有度篩選")
    card_type: Optional[List[CardType]] = Field(None, description="屬性篩選")
    condition: Optional[List[CardCondition]] = Field(None, description="狀態篩選")
    price_min: Optional[float] = Field(None, ge=0, description="最低價格")
    price_max: Optional[float] = Field(None, ge=0, description="最高價格")
    set_name: Optional[str] = Field(None, description="卡包名稱")
    sort_by: Optional[str] = Field("created_at", description="排序方式：created_at, price_hkd")
    sort_order: Optional[str] = Field("desc", description="排序方向：asc, desc")
    page: int = Field(1, ge=1, description="頁碼")
    page_size: int = Field(20, ge=1, le=100, description="每頁數量")


class PaginatedResponse(BaseModel):
    """分頁回應"""
    items: List[ListingResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# ==================== 通用回應 ====================

class MessageResponse(BaseModel):
    """通用訊息回應"""
    message: str
    success: bool = True
