"""
CardTrade 資料庫模型
使用 SQLAlchemy 定義所有資料表結構
"""
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, Boolean, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum


# ==================== 列舉類型 ====================

class CardRarity(str, enum.Enum):
    """卡片稀有度"""
    COMMON = "Common"
    UNCOMMON = "Uncommon"
    RARE = "Rare"
    HOLO_RARE = "Holo Rare"
    ULTRA_RARE = "Ultra Rare"
    SECRET_RARE = "Secret Rare"
    SPECIAL_ILLUSTRATION_RARE = "Special Illustration Rare"
    GOLD_RARE = "Gold Rare"
    ALT_ART = "Alt Art"


class CardCondition(str, enum.Enum):
    """卡片狀態"""
    NEAR_MINT = "Near Mint"
    LIGHTLY_PLAYED = "Lightly Played"
    MODERATELY_PLAYED = "Moderately Played"
    HEAVILY_PLAYED = "Heavily Played"
    DAMAGED = "Damaged"


class CardType(str, enum.Enum):
    """寶可夢屬性"""
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


class ListingStatus(str, enum.Enum):
    """刊登狀態"""
    ACTIVE = "active"       # 已刊登
    SOLD = "sold"           # 已售出
    CANCELLED = "cancelled" # 已取消


# ==================== 資料表模型 ====================

class User(Base):
    """用戶表"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False, comment="用戶名")
    email = Column(String(100), unique=True, index=True, nullable=False, comment="電郵")
    hashed_password = Column(String(255), nullable=False, comment="加密密碼")
    whatsapp = Column(String(20), nullable=True, comment="WhatsApp 號碼（格式：+85212345678）")
    display_name = Column(String(100), nullable=True, comment="顯示名稱")
    is_active = Column(Boolean, default=True, comment="帳號是否啟用")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), comment="建立時間")
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), comment="更新時間")

    # 關聯
    listings = relationship("Listing", back_populates="seller", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>"


class Card(Base):
    """寶可夢卡片資料表"""
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    card_name = Column(String(200), nullable=False, index=True, comment="卡片名稱（中英）")
    card_number = Column(String(20), nullable=True, comment="卡片編號（如 001/091）")
    set_name = Column(String(200), nullable=True, index=True, comment="卡包名稱")
    rarity = Column(SQLEnum(CardRarity), nullable=True, index=True, comment="稀有度")
    card_type = Column(SQLEnum(CardType), nullable=True, index=True, comment="屬性/類型")
    hp = Column(Integer, nullable=True, comment="HP 值")
    description = Column(Text, nullable=True, comment="卡片描述")
    estimated_price_hkd = Column(Float, nullable=True, comment="估計價格（港幣）")
    image_url = Column(String(500), nullable=True, comment="卡片圖片網址")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), comment="建立時間")

    # 關聯
    listings = relationship("Listing", back_populates="card")

    def __repr__(self):
        return f"<Card(id={self.id}, name='{self.card_name}', rarity={self.rarity})>"


class Listing(Base):
    """刊登（賣家上架）表"""
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False, comment="賣家 ID")
    card_id = Column(Integer, ForeignKey("cards.id"), nullable=False, comment="卡片 ID")
    condition = Column(SQLEnum(CardCondition), nullable=False, comment="卡片狀態")
    price_hkd = Column(Float, nullable=False, comment="售價（港幣）")
    quantity = Column(Integer, default=1, comment="數量")
    description = Column(Text, nullable=True, comment="賣家備註")
    status = Column(SQLEnum(ListingStatus), default=ListingStatus.ACTIVE, index=True, comment="刊登狀態")
    image_url = Column(String(500), nullable=True, comment="實物照片網址")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), comment="刊登時間")
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), comment="更新時間")

    # 關聯
    seller = relationship("User", back_populates="listings")
    card = relationship("Card", back_populates="listings")

    def __repr__(self):
        return f"<Listing(id={self.id}, card='{self.card.card_name}', price={self.price_hkd} HKD)>"
