"""
圖片上傳 + AI 分析路由
處理圖片上傳和呼叫 Gemini API 識別卡片
"""
import os
import uuid
import base64
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from database import get_db
from models import Card, User
from routers.auth import get_current_user
from schemas import CardResponse, AIRecognitionResult, MessageResponse
from services.gemini_service import recognize_card

router = APIRouter(prefix="/api/upload", tags=["圖片上傳與 AI 識別"])

# 上傳目錄設定
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
MAX_FILE_SIZE = int(os.getenv("MAX_UPLOAD_SIZE", 5242880))  # 預設 5MB


@router.post("/recognize", response_model=AIRecognitionResult, summary="上傳卡片照片進行 AI 識別")
async def recognize_card_image(
    file: UploadFile = File(..., description="卡片照片（JPG/PNG，最大 5MB）"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    上傳寶可夢卡片照片，使用 Google Gemini AI 自動識別：

    - **file**: 卡片照片（支援 JPG、PNG 格式，最大 5MB）
    - 回傳識別結果：卡片名稱、稀有度、卡包、估價等
    """
    # 檢查檔案類型
    if file.content_type not in ["image/jpeg", "image/png", "image/webp", "image/jpg"]:
        raise HTTPException(status_code=400, detail="只支援 JPG、PNG、WebP 格式的圖片")

    # 讀取檔案內容
    content = await file.read()

    # 檢查檔案大小
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="圖片大小不能超過 5MB")

    # 呼叫 AI API 進行卡片識別（傳入原始 bytes）
    result = await recognize_card(content, file.content_type)

    return result


@router.post("/listing", response_model=CardResponse, summary="上傳卡片照片並建立刊登")
async def create_card_with_image(
    file: UploadFile = File(..., description="卡片照片"),
    card_name: str = Form(..., description="卡片名稱"),
    card_number: str = Form(None, description="卡片編號"),
    set_name: str = Form(None, description="卡包名稱"),
    rarity: str = Form(None, description="稀有度"),
    card_type: str = Form(None, description="屬性"),
    hp: int = Form(None, description="HP 值"),
    description: str = Form(None, description="卡片描述"),
    estimated_price_hkd: float = Form(None, description="估計價格（港幣）"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    上傳卡片照片並同時建立卡片資料
    照片會儲存在伺服器上
    """
    # 確保上傳目錄存在
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # 生成唯一檔案名
    file_ext = file.filename.rsplit(".", 1)[-1] if file.filename and "." in file.filename else "jpg"
    unique_filename = f"{uuid.uuid4().hex}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # 儲存檔案
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    # 建立卡片資料
    from models import CardRarity, CardType

    # 將字串轉為列舉值
    rarity_enum = None
    if rarity:
        try:
            rarity_enum = CardRarity(rarity)
        except ValueError:
            pass

    card_type_enum = None
    if card_type:
        try:
            card_type_enum = CardType(card_type)
        except ValueError:
            pass

    new_card = Card(
        card_name=card_name,
        card_number=card_number,
        set_name=set_name,
        rarity=rarity_enum,
        card_type=card_type_enum,
        hp=hp,
        description=description,
        estimated_price_hkd=estimated_price_hkd,
        image_url=f"/uploads/{unique_filename}"
    )
    db.add(new_card)
    db.commit()
    db.refresh(new_card)

    return CardResponse.model_validate(new_card)
