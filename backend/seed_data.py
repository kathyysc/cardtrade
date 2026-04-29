"""
種子資料
預設的測試用卡片和刊登資料
"""
from sqlalchemy.orm import Session
from models import User, Card, Listing, CardRarity, CardCondition, CardType, ListingStatus
import bcrypt


def hash_pw(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def seed_database(db: Session):
    """建立測試用的種子資料（只在資料庫為空時執行）"""

    # 檢查是否已有資料
    if db.query(User).first():
        print("資料庫已有資料，跳過種子資料建立。")
        return

    print("正在建立種子資料...")

    # ==================== 建立測試用戶 ====================
    test_users = [
        User(
            username="kathy",
            email="kathy@example.com",
            hashed_password=hash_pw("password123"),
            whatsapp="+85263388538",
            display_name="Kathy",
            is_active=True,
        ),
        User(
            username="pokemon_master",
            email="ash@example.com",
            hashed_password=hash_pw("password123"),
            whatsapp="+85291234567",
            display_name="小智",
            is_active=True,
        ),
        User(
            username="card_collector",
            email="misty@example.com",
            hashed_password=hash_pw("password123"),
            whatsapp="+85298765432",
            display_name="小霞",
            is_active=True,
        ),
    ]
    db.add_all(test_users)
    db.flush()

    # ==================== 建立測試卡片 ====================
    test_cards = [
        Card(
            card_name="皮卡丘 VMAX / Pikachu VMAX",
            card_number="044/185",
            set_name="Vivid Voltage",
            rarity=CardRarity.ULTRA_RARE,
            card_type=CardType.LIGHTNING,
            hp=310,
            description="經典皮卡丘 VMAX，人氣卡牌",
            estimated_price_hkd=280.0,
        ),
        Card(
            card_name="噴火龍 V / Charizard V",
            card_number="031/198",
            set_name="Chilling Reign",
            rarity=CardRarity.ULTRA_RARE,
            card_type=CardType.FIRE,
            hp=220,
            description="經典噴火龍 V，高人氣卡牌",
            estimated_price_hkd=350.0,
        ),
        Card(
            card_name="夢幻 / Mew",
            card_number="114/091",
            set_name="Fusion Strike",
            rarity=CardRarity.SECRET_RARE,
            card_type=CardType.PSYCHIC,
            hp=120,
            description="夢幻 SR，收藏用",
            estimated_price_hkd=150.0,
        ),
        Card(
            card_name="路卡利歐 VSTAR / Lucario VSTAR",
            card_number="119/167",
            set_name="Astral Radiance",
            rarity=CardRarity.GOLD_RARE,
            card_type=CardType.FIGHTING,
            hp=280,
            description="路卡利歐金閃卡，稀有",
            estimated_price_hkd=420.0,
        ),
        Card(
            card_name="伊布 VMAX / Eevee VMAX",
            card_number="203/203",
            set_name="Evolving Skies",
            rarity=CardRarity.SECRET_RARE,
            card_type=CardType.COLORLESS,
            hp=310,
            description="伊布進化版 VMAX，極具收藏價值",
            estimated_price_hkd=580.0,
        ),
        Card(
            card_name="烈空坐 VMAX / Rayquaza VMAX",
            card_number="218/203",
            set_name="Evolving Skies",
            rarity=CardRarity.ALT_ART,
            card_type=CardType.DRAGON,
            hp=320,
            description="Alt Art 烈空坐，超高人氣插畫卡",
            estimated_price_hkd=2500.0,
        ),
        Card(
            card_name="耿鬼 VMAX / Gengar VMAX",
            card_number="271/203",
            set_name="Evolving Skies",
            rarity=CardRarity.ALT_ART,
            card_type=CardType.PSYCHIC,
            hp=330,
            description="Alt Art 耿鬼，收藏級卡牌",
            estimated_price_hkd=880.0,
        ),
        Card(
            card_name="妙蛙種子 / Bulbasaur",
            card_number="001/091",
            set_name="Scarlet & Violet Base",
            rarity=CardRarity.COMMON,
            card_type=CardType.GRASS,
            hp=70,
            description="初代御三家之一",
            estimated_price_hkd=2.0,
        ),
        Card(
            card_name="傑尼龜 / Squirtle",
            card_number="012/091",
            set_name="Scarlet & Violet Base",
            rarity=CardRarity.COMMON,
            card_type=CardType.WATER,
            hp=70,
            description="初代御三家之一",
            estimated_price_hkd=2.0,
        ),
        Card(
            card_name="小火龍 / Charmander",
            card_number="007/091",
            set_name="Scarlet & Violet Base",
            rarity=CardRarity.COMMON,
            card_type=CardType.FIRE,
            hp=70,
            description="初代御三家之一",
            estimated_price_hkd=3.0,
        ),
        Card(
            card_name="暴鯉龍 V / Gyarados V",
            card_number="032/203",
            set_name="Evolving Skies",
            rarity=CardRarity.HOLO_RARE,
            card_type=CardType.WATER,
            hp=210,
            description="暴鯉龍 V，罕見全息卡",
            estimated_price_hkd=45.0,
        ),
        Card(
            card_name="超夢 / Mewtwo",
            card_number="080/091",
            set_name="Scarlet & Violet Base",
            rarity=CardRarity.RARE,
            card_type=CardType.PSYCHIC,
            hp=130,
            description="超夢，經典強力卡",
            estimated_price_hkd=8.0,
        ),
    ]
    db.add_all(test_cards)
    db.flush()

    # ==================== 建立測試刊登 ====================
    test_listings = [
        Listing(seller_id=1, card_id=1, condition=CardCondition.NEAR_MINT, price_hkd=250.0, quantity=1,
                description="全新近未使用狀態，有卡套", status=ListingStatus.ACTIVE),
        Listing(seller_id=2, card_id=2, condition=CardCondition.LIGHTLY_PLAYED, price_hkd=300.0, quantity=1,
                description="輕微使用痕跡，整體良好", status=ListingStatus.ACTIVE),
        Listing(seller_id=3, card_id=3, condition=CardCondition.NEAR_MINT, price_hkd=130.0, quantity=1,
                description="全新狀態，未開封卡包拆出", status=ListingStatus.ACTIVE),
        Listing(seller_id=1, card_id=4, condition=CardCondition.NEAR_MINT, price_hkd=400.0, quantity=1,
                description="金閃卡，非常亮麗", status=ListingStatus.ACTIVE),
        Listing(seller_id=2, card_id=5, condition=CardCondition.NEAR_MINT, price_hkd=550.0, quantity=1,
                description="秘密稀有，送卡磚", status=ListingStatus.ACTIVE),
        Listing(seller_id=3, card_id=6, condition=CardCondition.NEAR_MINT, price_hkd=2400.0, quantity=1,
                description="Alt Art 烈空坐，卡況完美，附收納盒", status=ListingStatus.ACTIVE),
        Listing(seller_id=1, card_id=7, condition=CardCondition.LIGHTLY_PLAYED, price_hkd=800.0, quantity=1,
                description="Alt Art 耿鬼，輕微邊角磨損", status=ListingStatus.ACTIVE),
        Listing(seller_id=2, card_id=8, condition=CardCondition.MODERATELY_PLAYED, price_hkd=1.0, quantity=3,
                description="普通卡，有一些磨損", status=ListingStatus.ACTIVE),
        Listing(seller_id=3, card_id=9, condition=CardCondition.NEAR_MINT, price_hkd=2.0, quantity=2,
                description="全新狀態", status=ListingStatus.ACTIVE),
        Listing(seller_id=1, card_id=10, condition=CardCondition.LIGHTLY_PLAYED, price_hkd=2.5, quantity=5,
                description="輕微使用痕跡", status=ListingStatus.ACTIVE),
        Listing(seller_id=2, card_id=11, condition=CardCondition.NEAR_MINT, price_hkd=40.0, quantity=2,
                description="全息卡，閃亮動人", status=ListingStatus.ACTIVE),
        Listing(seller_id=3, card_id=12, condition=CardCondition.MODERATELY_PLAYED, price_hkd=6.0, quantity=1,
                description="有些磨損但卡面清晰", status=ListingStatus.ACTIVE),
    ]
    db.add_all(test_listings)

    db.commit()
    print("種子資料建立完成！")
    print(f"  - 用戶：{len(test_users)} 個")
    print(f"  - 卡片：{len(test_cards)} 張")
    print(f"  - 刊登：{len(test_listings)} 筆")
    print("\n測試帳號：")
    print("  用戶名：kathy / 密碼：password123")
    print("  用戶名：pokemon_master / 密碼：password123")
    print("  用戶名：card_collector / 密碼：password123")
