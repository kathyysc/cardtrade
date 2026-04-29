"""
刊登（上架/下架）路由
處理賣家上架卡片的 CRUD 操作
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models import Card, Listing, User, ListingStatus
from routers.auth import get_current_user
from schemas import (
    ListingCreate, ListingUpdate, ListingResponse,
    CardResponse, UserResponse, PaginatedResponse, MessageResponse
)

router = APIRouter(prefix="/api/listings", tags=["刊登管理"])


@router.post("/", response_model=ListingResponse, summary="建立刊登")
def create_listing(
    listing_data: ListingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    建立新的刊登（上架賣卡）

    - **card_id**: 卡片 ID
    - **condition**: 卡片狀態（NM/LP/MP/HP/D）
    - **price_hkd**: 售價（港幣）
    - **quantity**: 數量
    """
    # 檢查卡片是否存在
    card = db.query(Card).filter(Card.id == listing_data.card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="找不到此卡片")

    new_listing = Listing(
        seller_id=current_user.id,
        card_id=listing_data.card_id,
        condition=listing_data.condition,
        price_hkd=listing_data.price_hkd,
        quantity=listing_data.quantity,
        description=listing_data.description,
        image_url=listing_data.image_url,
        status=ListingStatus.ACTIVE,
    )
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)

    return _build_listing_response(new_listing)


@router.get("/", response_model=PaginatedResponse, summary="瀏覽刊登列表")
def list_listings(
    page: int = Query(1, ge=1, description="頁碼"),
    page_size: int = Query(20, ge=1, le=100, description="每頁數量"),
    keyword: Optional[str] = Query(None, description="搜尋關鍵字"),
    rarity: Optional[str] = Query(None, description="稀有度"),
    card_type: Optional[str] = Query(None, description="屬性"),
    condition: Optional[str] = Query(None, description="狀態"),
    price_min: Optional[float] = Query(None, description="最低價格"),
    price_max: Optional[float] = Query(None, description="最高價格"),
    sort_by: str = Query("created_at", description="排序方式"),
    sort_order: str = Query("desc", description="排序方向"),
    db: Session = Depends(get_db)
):
    """
    瀏覽所有已刊登的卡片，支援搜尋和篩選
    """
    query = db.query(Listing).filter(Listing.status == ListingStatus.ACTIVE)

    # 關鍵字搜尋（搜尋卡片名稱）
    if keyword:
        query = query.join(Card).filter(Card.card_name.ilike(f"%{keyword}%"))

    # 稀有度篩選
    if rarity:
        query = query.join(Card).filter(Card.rarity == rarity)

    # 屬性篩選
    if card_type:
        query = query.join(Card).filter(Card.card_type == card_type)

    # 狀態篩選
    if condition:
        query = query.filter(Listing.condition == condition)

    # 價格範圍
    if price_min is not None:
        query = query.filter(Listing.price_hkd >= price_min)
    if price_max is not None:
        query = query.filter(Listing.price_hkd <= price_max)

    # 排序
    sort_column = getattr(Listing, sort_by, Listing.created_at)
    if sort_order == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    # 計算總數
    total = query.count()

    # 分頁
    listings = query.offset((page - 1) * page_size).limit(page_size).all()
    total_pages = (total + page_size - 1) // page_size

    return PaginatedResponse(
        items=[_build_listing_response(l) for l in listings],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


@router.get("/my", response_model=list[ListingResponse], summary="我的刊登")
def my_listings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """取得當前用戶的所有刊登"""
    listings = db.query(Listing).filter(Listing.seller_id == current_user.id).all()
    return [_build_listing_response(l) for l in listings]


@router.get("/{listing_id}", response_model=ListingResponse, summary="刊登詳情")
def get_listing(listing_id: int, db: Session = Depends(get_db)):
    """取得單個刊登的詳細資料"""
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="找不到此刊登")
    return _build_listing_response(listing)


@router.put("/{listing_id}", response_model=ListingResponse, summary="更新刊登")
def update_listing(
    listing_id: int,
    listing_data: ListingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """更新刊登資訊（只能更新自己的刊登）"""
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="找不到此刊登")

    # 權限檢查
    if listing.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="你只能修改自己的刊登")

    # 更新欄位
    update_data = listing_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(listing, field, value)

    db.commit()
    db.refresh(listing)
    return _build_listing_response(listing)


@router.delete("/{listing_id}", response_model=MessageResponse, summary="刪除刊登")
def delete_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """刪除刊登（只能刪除自己的刊登）"""
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="找不到此刊登")

    if listing.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="你只能刪除自己的刊登")

    listing.status = ListingStatus.CANCELLED
    db.commit()
    return MessageResponse(message="刊登已取消")


def _build_listing_response(listing: Listing) -> ListingResponse:
    """建構包含關聯資料的刊登回應"""
    return ListingResponse(
        id=listing.id,
        seller_id=listing.seller_id,
        card_id=listing.card_id,
        condition=listing.condition,
        price_hkd=listing.price_hkd,
        quantity=listing.quantity,
        description=listing.description,
        status=listing.status.value if listing.status else "active",
        image_url=listing.image_url,
        created_at=listing.created_at,
        updated_at=listing.updated_at,
        card=CardResponse.model_validate(listing.card) if listing.card else None,
        seller=UserResponse.model_validate(listing.seller) if listing.seller else None,
    )
