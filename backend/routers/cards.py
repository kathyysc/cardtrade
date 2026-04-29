"""
卡片 CRUD 路由
處理卡片的建立、讀取、更新、刪除
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from database import get_db
from models import Card, User
from routers.auth import get_current_user
from schemas import (
    CardCreate, CardUpdate, CardResponse,
    MessageResponse, PaginatedResponse
)

router = APIRouter(prefix="/api/cards", tags=["卡片管理"])


@router.post("/", response_model=CardResponse, summary="建立新卡片")
def create_card(
    card_data: CardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    建立新的寶可夢卡片資料
    需要先登入才能操作
    """
    new_card = Card(**card_data.model_dump())
    db.add(new_card)
    db.commit()
    db.refresh(new_card)
    return CardResponse.model_validate(new_card)


@router.get("/", response_model=PaginatedResponse, summary="取得卡片列表")
def list_cards(
    page: int = Query(1, ge=1, description="頁碼"),
    page_size: int = Query(20, ge=1, le=100, description="每頁數量"),
    rarity: Optional[str] = Query(None, description="稀有度篩選"),
    card_type: Optional[str] = Query(None, description="屬性篩選"),
    set_name: Optional[str] = Query(None, description="卡包名稱篩選"),
    db: Session = Depends(get_db)
):
    """
    取得所有卡片列表，支援分頁和篩選
    """
    query = db.query(Card)

    # 篩選條件
    if rarity:
        query = query.filter(Card.rarity == rarity)
    if card_type:
        query = query.filter(Card.card_type == card_type)
    if set_name:
        query = query.filter(Card.set_name.ilike(f"%{set_name}%"))

    # 計算總數
    total = query.count()

    # 分頁
    cards = query.order_by(Card.created_at.desc()) \
        .offset((page - 1) * page_size) \
        .limit(page_size).all()

    total_pages = (total + page_size - 1) // page_size

    return PaginatedResponse(
        items=[CardResponse.model_validate(c) for c in cards],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


@router.get("/{card_id}", response_model=CardResponse, summary="取得卡片詳情")
def get_card(card_id: int, db: Session = Depends(get_db)):
    """根據 ID 取得單張卡片的詳細資料"""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="找不到此卡片")
    return CardResponse.model_validate(card)


@router.put("/{card_id}", response_model=CardResponse, summary="更新卡片資料")
def update_card(
    card_id: int,
    card_data: CardUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """更新卡片的資料（需登入）"""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="找不到此卡片")

    # 更新非空欄位
    update_data = card_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(card, field, value)

    db.commit()
    db.refresh(card)
    return CardResponse.model_validate(card)


@router.delete("/{card_id}", response_model=MessageResponse, summary="刪除卡片")
def delete_card(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """刪除卡片（需登入）"""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="找不到此卡片")

    db.delete(card)
    db.commit()
    return MessageResponse(message="卡片已刪除")
