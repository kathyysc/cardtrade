"""
Google Gemini AI 卡片識別服務
使用 Gemini Vision API 識別寶可夢卡片
"""
import os
import json
import google.generativeai as genai
from schemas import AIRecognitionResult


def _init_gemini():
    """初始化 Gemini API"""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
        raise ValueError(
            "請設定 GEMINI_API_KEY 環境變數。"
            "免費申請：https://aistudio.google.com/apikey"
        )
    genai.configure(api_key=api_key)
    return genai.GenerativeModel("gemini-2.0-flash")


async def recognize_card(image_base64: str, mime_type: str) -> AIRecognitionResult:
    """
    使用 Gemini Vision API 識別寶可夢卡片

    參數：
        image_base64: 圖片的 base64 編碼
        mime_type: 圖片的 MIME 類型（如 image/jpeg）

    回傳：
        AIRecognitionResult：識別結果
    """
    model = _init_gemini()

    # 建立圖片 parts
    image_part = {
        "mime_type": mime_type,
        "data": image_base64
    }

    # 設定識別提示詞
    prompt = """
你是一位專業的寶可夢卡片鑑定師。請分析這張寶可夢卡片的照片，並返回以下資訊。

請嚴格按照以下 JSON 格式回應（不要加任何其他文字或 markdown 標記）：
{
    "card_name": "卡片名稱（中英文都寫，如：皮卡丘 / Pikachu）",
    "card_number": "卡片編號（如 001/091）",
    "set_name": "卡包名稱（如： Scarlet & Violet Base Set）",
    "rarity": "稀有度，從以下選擇：Common, Uncommon, Rare, Holo Rare, Ultra Rare, Secret Rare, Special Illustration Rare, Gold Rare, Alt Art",
    "card_type": "屬性，從以下選擇：草, 火, 水, 雷, 超能力, 格鬥, 惡, 鋼, 妖精, 龍, 無色, 訓練家卡, 能量卡, 其他",
    "hp": 100,
    "estimated_price_hkd": 10.0,
    "description": "簡短描述這張卡片（20字以內）",
    "confidence": 0.95
}

注意事項：
1. 如果是訓練家卡（Trainer）或能量卡（Energy），card_type 請填寫對應類型
2. estimated_price_hkd 請估計港幣價格（参考二手市場行情）
3. 如果無法辨識，confidence 設為 0，並在 description 說明原因
4. 如果照片不是寶可夢卡片，card_name 填 "無法辨識"，confidence 設為 0
5. 只回傳 JSON，不要任何其他格式
"""

    try:
        # 呼叫 Gemini API
        response = await model.generate_content_async(
            [prompt, image_part],
            generation_config={
                "temperature": 0.2,  # 低溫度 = 更穩定的輸出
                "top_p": 0.8,
                "max_output_tokens": 500,
            }
        )

        # 解析回應
        text = response.text.strip()

        # 清理可能的 markdown 標記
        if text.startswith("```"):
            text = text.split("\n", 1)[1] if "\n" in text else text[3:]
        if text.endswith("```"):
            text = text[:-3]
        if text.startswith("json"):
            text = text[4:]
        text = text.strip()

        data = json.loads(text)

        return AIRecognitionResult(
            card_name=data.get("card_name", "未知卡片"),
            card_number=data.get("card_number"),
            set_name=data.get("set_name"),
            rarity=data.get("rarity"),
            card_type=data.get("card_type"),
            hp=data.get("hp"),
            estimated_price_hkd=data.get("estimated_price_hkd"),
            description=data.get("description"),
            confidence=data.get("confidence"),
        )

    except json.JSONDecodeError as e:
        # 如果 AI 回傳的不是有效 JSON，返回預設結果
        return AIRecognitionResult(
            card_name="識別失敗",
            description=f"AI 回傳格式異常，請重新拍照嘗試。錯誤：{str(e)[:100]}",
            confidence=0.0,
        )
    except Exception as e:
        return AIRecognitionResult(
            card_name="識別失敗",
            description=f"AI 服務出現錯誤，請稍後再試。錯誤：{str(e)[:100]}",
            confidence=0.0,
        )
