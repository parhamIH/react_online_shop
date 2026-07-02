
import os
import django
import random
import uuid
from decimal import Decimal
from django.db.models.signals import post_save
from django.utils.text import slugify

# Configure Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from shop.account.models import Profile, ClientAddress, Notification, FavouriteProducts, UserCoupon
from shop.articles.models import Article
from shop.categories.models import BaseCategories, Category
from shop.public.models import Warranty, Brand, BaseColor, Color, Size
from shop.providers.models import Provider, ProviderMember
from shop.products.models import Product, ProductPackage, Gallery
from shop.reviews.models import Comment
from shop.home.models import HomeSlider, PromotionalBanner, FeaturedBrand
from shop.cart.models import Cart, CartItem
from shop.order.models import Order
from shop.sitesettings.models import SiteSettings, StaticPage
from shop.support.models import SupportTicket, TicketReply
from shop.providers.signals import set_user_as_staff, assign_provider_permissions


# ==================================================
# Data: Real Persian + English Fashion Store
# ==================================================

BASE_CATEGORIES = [
    {"name": "لباس", "en_name": "Clothing", "description": "تمام انواع لباس‌های مردانه و زنانه"},
    {"name": "کفش", "en_name": "Shoes", "description": "کفش‌های ورزشی، کلاسیک، رسمی و Casual"},
    {"name": "اکسسوری", "en_name": "Accessories", "description": "کیف، ساعت، کمربند، کلاه، شال و..."},
    {"name": "عطر", "en_name": "Fragrances", "description": "عطرهای مردانه و زنانه برندهای معتبر"},
    {"name": "ساعت", "en_name": "Watches", "description": "ساعت‌های مچی، هوشمند و کلاسیک"},
]

CATEGORIES = [
    # Clothing
    {"parent": None, "base": "لباس", "name": "لباس مردانه", "en_name": "Men's Clothing", "description": "شلوار، پیراهن، کاپشن و... برای آقایان"},
    {"parent": "لباس مردانه", "base": "لباس", "name": "شلوار مردانه", "en_name": "Men's Pants", "description": "شلوارهای جین، کتان، کلاسیک"},
    {"parent": "لباس مردانه", "base": "لباس", "name": "پیراهن مردانه", "en_name": "Men's Shirts", "description": "پیراهن‌های رسمی، کتانی، چوبی"},
    {"parent": "لباس مردانه", "base": "لباس", "name": "تیشرت مردانه", "en_name": "Men's T-Shirts", "description": "تیشرت‌های ساده، چاپی، ورزشی"},
    {"parent": "لباس مردانه", "base": "لباس", "name": "ژاکت مردانه", "en_name": "Men's Jackets", "description": "ژاکت‌های چرم، باری، کتان"},
    {"parent": "لباس", "base": "لباس", "name": "لباس زنانه", "en_name": "Women's Clothing", "description": "لباس‌های شیک و مدرن برای بانوان"},
    {"parent": "لباس زنانه", "base": "لباس", "name": "بلوز زنانه", "en_name": "Women's Blouses", "description": "بلوزهای شیک و متنوع"},
    {"parent": "لباس زنانه", "base": "لباس", "name": "دامن زنانه", "en_name": "Women's Skirts", "description": "دامن‌های کوتاه، بلند، مگاسی"},
    {"parent": "لباس زنانه", "base": "لباس", "name": "شال و روسری", "en_name": "Scarves & Shawls", "description": "شال‌های متنوع و شیک"},
    # Shoes
    {"parent": None, "base": "کفش", "name": "کفش مردانه", "en_name": "Men's Shoes", "description": "کفش‌های ورزشی، کلاسیک، رسمی"},
    {"parent": None, "base": "کفش", "name": "کفش زنانه", "en_name": "Women's Shoes", "description": "کفش‌های شیک و راحت"},
    # Accessories
    {"parent": None, "base": "اکسسوری", "name": "کیف", "en_name": "Bags", "description": "کیف‌های دفتری، کوله، کلاچ"},
    {"parent": None, "base": "اکسسوری", "name": "کمربند", "en_name": "Belts", "description": "کمربند‌های چرم، پارچه، کلاسیک"},
    # Fragrances
    {"parent": None, "base": "عطر", "name": "عطر مردانه", "en_name": "Men's Fragrances", "description": "عطر‌های مردانه ماندگار"},
    {"parent": None, "base": "عطر", "name": "عطر زنانه", "en_name": "Women's Fragrances", "description": "عطر‌های زنانه شیک"},
    # Watches
    {"parent": None, "base": "ساعت", "name": "ساعت مردانه", "en_name": "Men's Watches", "description": "ساعت‌های کلاسیک و مدرن"},
    {"parent": None, "base": "ساعت", "name": "ساعت زنانه", "en_name": "Women's Watches", "description": "ساعت‌های شیک و ظریف"},
]

BRANDS = [
    {"name": "نایک", "en_name": "Nike", "categories": ["کفش مردانه", "کفش زنانه", "تیشرت مردانه"]},
    {"name": "آدیداس", "en_name": "Adidas", "categories": ["کفش مردانه", "کفش زنانه", "تیشرت مردانه"]},
    {"name": "زارا", "en_name": "Zara", "categories": ["لباس مردانه", "لباس زنانه", "بلوز زنانه", "پیراهن مردانه"]},
    {"name": "اچ اند ام", "en_name": "H&M", "categories": ["لباس مردانه", "لباس زنانه", "تیشرت مردانه", "بلوز زنانه"]},
    {"name": "منگو", "en_name": "Mango", "categories": ["لباس زنانه", "بلوز زنانه", "دامن زنانه"]},
    {"name": "گس", "en_name": "Guess", "categories": ["کیف", "ساعت زنانه", "ساعت مردانه"]},
    {"name": "دیزل", "en_name": "Diesel", "categories": ["شلوار مردانه", "کمربند", "ژاکت مردانه"]},
    {"name": "کالواین کلاین", "en_name": "Calvin Klein", "categories": ["عطر مردانه", "عطر زنانه", "تیشرت مردانه"]},
    {"name": "ژاکبس", "en_name": "Jacobs", "categories": ["عطر زنانه", "عطر مردانه"]},
    {"name": "تمی هیلفیگر", "en_name": "Tommy Hilfiger", "categories": ["پیراهن مردانه", "کمربند", "ساعت مردانه"]},
]

WARRANTIES = [
    {"name": "گارانتی اصالت و سلامت فیزیکی", "company": "فروشگاه", "duration": 12, "description": "گارانتی اصالت و سلامت فیزیکی کالا به مدت ۱۲ ماه"},
    {"name": "گارانتی اصلی برند", "company": "نمایندگی رسمی", "duration": 24, "description": "گارانتی رسمی برند به مدت ۲۴ ماه"},
    {"name": "گارانتی ویژه", "company": "فروشگاه", "duration": 6, "description": "گارانتی ویژه فروشگاه به مدت ۶ ماه"},
]

BASE_COLORS = [
    {"name": "مشکی", "hex": "#000000"},
    {"name": "سفید", "hex": "#FFFFFF"},
    {"name": "خاکستری", "hex": "#808080"},
    {"name": "آبی", "hex": "#0000FF"},
    {"name": "قرمز", "hex": "#FF0000"},
    {"name": "سبز", "hex": "#008000"},
    {"name": "بنفش", "hex": "#800080"},
    {"name": "زرد", "hex": "#FFFF00"},
    {"name": "صورتی", "hex": "#FFC0CB"},
    {"name": "قهوه‌ای", "hex": "#8B4513"},
]

COLORS = [
    {"name": "مشکی", "hex": "#000000", "base": "مشکی"},
    {"name": "سفید", "hex": "#FFFFFF", "base": "سفید"},
    {"name": "خاکستری روشن", "hex": "#D3D3D3", "base": "خاکستری"},
    {"name": "خاکستری تیره", "hex": "#36454F", "base": "خاکستری"},
    {"name": "آبی تیره", "hex": "#00008B", "base": "آبی"},
    {"name": "آبی روشن", "hex": "#87CEEB", "base": "آبی"},
    {"name": "قرمز تیره", "hex": "#8B0000", "base": "قرمز"},
    {"name": "قهوه‌ای روشن", "hex": "#D2B48C", "base": "قهوه‌ای"},
    {"name": "صورتی ملایم", "hex": "#FFB6C1", "base": "صورتی"},
]

SIZES = [
    # Letter sizes for clothing
    {"size": "XS", "size_num": None, "size_numrical": "XS", "category": "clothing"},
    {"size": "S", "size_num": None, "size_numrical": "S", "category": "clothing"},
    {"size": "M", "size_num": None, "size_numrical": "M", "category": "clothing"},
    {"size": "L", "size_num": None, "size_numrical": "L", "category": "clothing"},
    {"size": "XL", "size_num": None, "size_numrical": "XL", "category": "clothing"},
    {"size": "XXL", "size_num": None, "size_numrical": "XXL", "category": "clothing"},
    # Numeric sizes for shoes (Men)
    {"size": None, "size_num": 40, "size_numrical": "40", "category": "shoes"},
    {"size": None, "size_num": 41, "size_numrical": "41", "category": "shoes"},
    {"size": None, "size_num": 42, "size_numrical": "42", "category": "shoes"},
    {"size": None, "size_num": 43, "size_numrical": "43", "category": "shoes"},
    {"size": None, "size_num": 44, "size_numrical": "44", "category": "shoes"},
    {"size": None, "size_num": 45, "size_numrical": "45", "category": "shoes"},
    # Numeric sizes for shoes (Women)
    {"size": None, "size_num": 36, "size_numrical": "36", "category": "shoes"},
    {"size": None, "size_num": 37, "size_numrical": "37", "category": "shoes"},
    {"size": None, "size_num": 38, "size_numrical": "38", "category": "shoes"},
    {"size": None, "size_num": 39, "size_numrical": "39", "category": "shoes"},
]

PROVINCES = [
    "تهران", "اصفهان", "فارس", "خوزستان", "گیلان", "مازندران", "قم",
    "قزوین", "زنجان", "آذربایجان شرقی", "آذربایجان غربی", "کردستان"
]

CITIES = [
    "تهران", "اصفهان", "شیراز", "اهواز", "رشت", "ساری", "قم", "قزوین", "زنجان",
    "تبریز", "ارومیه", "سنندج"
]

FIRST_NAMES_FA = ["علی", "رضا", "محمد", "امیر", "مهدی", "حسین", "سارا", "مریم", "زهرا", "نازنین", "فاطمه", "نسترن"]
LAST_NAMES_FA = ["محمدی", "رضایی", "حسینی", "علیزاده", "کاظمی", "مرادی", "نوری", "رحیمی", "یوسفی", "قاسمی"]

PRODUCT_NAMES_MEN = [
    "تیشرت آستین کوتاه اسپرت", "تیشرت چاپی طرح گرافیک", "پیراهن رسمی کتان نقره‌ای",
    "پیراهن چوبی لنجتی", "شلوار جین اسلیم فیت", "شلوار کتان کلاسیک مشکی",
    "ژاکت چرم طبیعی قهوه‌ای", "ژاکت باری نازک تابستانی", "کاپشن ورزشی ساقدار",
    "تاپ ورزشی سلیقه‌ای", "شلوار ورزشی ساده", "ست ورزشی مردانه"
]

PRODUCT_NAMES_WOMEN = [
    "بلوز چوبی دامن دار", "بلوز دکمه‌ای کتان سفید", "تیشرت آستین بلوک رنگ",
    "دامن مگاسی کشی", "دامن کوتاه پرپرده", "شال کتان طرح هندسی",
    "روسری شیک بامبویی", "کاپشن زنانه مولتی کالر", "بلوز کلاسیک کارخانه‌ای",
    "تاپ کاری بافت‌دار", "مانتو نازک تابستانی", "دامن بلند چوبی"
]

PRODUCT_NAMES_SHOES = [
    "کفش ورزشی نایک ایرمکس", "کفش رانینگ آدیداس اولترابوست", "کفش کلاسیک چرم",
    "کفش رسمی پلتو مشکی", "کفش کتانی کانورس", "کفش کتان طرح ساده",
    "کفش بوت کوتاه چرم", "کفش صندل ورزشی"
]

PRODUCT_NAMES_ACCESSORIES = [
    "کیف دفتری چرم مشکی", "کوله پشتی نایلونی مقاوم", "کلاچ شیک طرح گل",
    "کمربند چرم طبیعی", "کمربند پارچه کتان", "کمربند کلاسیک دکمه‌ای",
    "کلاه بیسبال", "عینک آفتابی مدرن", "دستبند چرمی"
]

PRODUCT_NAMES_FRAGRANCES = [
    "عطر مردانه بلو دوشنبه", "عطر زنانه چنل شماره 5", "ادوپرفیوم دیور ساواج",
    "ادوتوالت گورجیو آرمانی", "عطر مردانه پاکو رابان", "عطر زنانه ویلا ویلدهی"
]

PRODUCT_NAMES_WATCHES = [
    "ساعت کلاسیک تیسو", "ساعت مدرن دیزل", "ساعت هوشمند اپل واچ",
    "ساعت چرمی فسیل", "ساعت اسپرت کاسیو", "ساعت کلاسیک مردانه"
]

REVIEWS = [
    "خیلی خوب بود، کیفیت عالی داشت.",
    "راضی بودم، به موقع ارسال شد.",
    "جنس خوبی داره، پیشنهاد می‌کنم.",
    "عالی! دقیقاً همون چیزی بود که می‌خواستم.",
    "کیفیت بسیار خوب و قیمت مناسب.",
    "راضی هستم، دوباره خرید می‌کنم.",
    "بد نبود، می‌تونست بهتر باشه.",
    "بسیار زیبا و شیک، عالی!",
    "بهترین خریدم از این فروشگاه.",
    "راحت و خوب، پیشنهاد می‌کنم."
]


# ==================================================
# Helper Functions
# ==================================================

def random_fa_phone():
    return f"09{random.randint(10000000, 99999999)}"

def random_postcode():
    return f"{random.randint(1000000000, 9999999999)}"

def random_address():
    street_types = ["خیابان", "کوچه", "بزرگراه"]
    street_names = ["شهید بهشتی", "ولیعصر", "آزادی", "انقلاب", "ملت", "بهشت", "گلستان"]
    return f"{random.choice(street_types)} {random.choice(street_names)}, پلاک {random.randint(1, 200)}, واحد {random.randint(1, 10)}"


# ==================================================
# Seed Functions
# ==================================================

def clear_all_data():
    print("🗑️ Clearing existing data...")
    TicketReply.objects.all().delete()
    SupportTicket.objects.all().delete()
    StaticPage.objects.all().delete()
    SiteSettings.objects.all().delete()
    Order.objects.all().delete()
    CartItem.objects.all().delete()
    Cart.objects.all().delete()
    FeaturedBrand.objects.all().delete()
    PromotionalBanner.objects.all().delete()
    HomeSlider.objects.all().delete()
    Comment.objects.all().delete()
    Gallery.objects.all().delete()
    ProductPackage.objects.all().delete()
    Product.objects.all().delete()
    ProviderMember.objects.all().delete()
    Provider.objects.all().delete()
    Size.objects.all().delete()
    Color.objects.all().delete()
    BaseColor.objects.all().delete()
    Warranty.objects.all().delete()
    Brand.objects.all().delete()
    Category.objects.all().delete()
    BaseCategories.objects.all().delete()
    Article.objects.all().delete()
    UserCoupon.objects.all().delete()
    FavouriteProducts.objects.all().delete()
    Notification.objects.all().delete()
    ClientAddress.objects.all().delete()
    Profile.objects.all().delete()
    User.objects.all().delete()
    print("✅ Data cleared!")


def create_base_categories():
    print("\n🏷️ Creating Base Categories...")
    base_cats = []
    for data in BASE_CATEGORIES:
        bc, _ = BaseCategories.objects.get_or_create(
            name=data["name"],
            defaults={
                "en_name": data["en_name"],
                "description": data["description"]
            }
        )
        base_cats.append(bc)
    print(f"✅ Created {len(base_cats)} Base Categories!")
    return base_cats


def create_categories(base_categories):
    print("\n🏷️ Creating Categories...")
    base_cat_map = {bc.name: bc for bc in base_categories}
    created_categories = {}
    categories = []

    # First create categories without parents
    for data in [c for c in CATEGORIES if not c["parent"]]:
        base_cat = base_cat_map.get(data["base"])
        if base_cat:
            cat, _ = Category.objects.get_or_create(
                name=data["name"],
                defaults={
                    "en_name": data["en_name"],
                    "base_catgory": base_cat,
                    "description": data["description"]
                }
            )
            created_categories[data["name"]] = cat
            categories.append(cat)

    # Now create categories with parents
    for data in [c for c in CATEGORIES if c["parent"]]:
        base_cat = base_cat_map.get(data["base"])
        parent = created_categories.get(data["parent"])
        if base_cat and parent:
            cat, _ = Category.objects.get_or_create(
                name=data["name"],
                defaults={
                    "en_name": data["en_name"],
                    "parent": parent,
                    "base_catgory": base_cat,
                    "description": data["description"]
                }
            )
            created_categories[data["name"]] = cat
            categories.append(cat)
    print(f"✅ Created {len(categories)} Categories!")
    return categories


def create_brands(categories):
    print("\n🏢 Creating Brands...")
    cat_map = {c.name: c for c in categories}
    brands = []
    for data in BRANDS:
        brand, _ = Brand.objects.get_or_create(
            name=data["name"],
            defaults={"en_name": data["en_name"]}
        )
        # Add categories
        brand_cats = [cat_map[name] for name in data["categories"] if name in cat_map]
        if brand_cats:
            brand.category.add(*brand_cats)
        brands.append(brand)
    print(f"✅ Created {len(brands)} Brands!")
    return brands


def create_warranties():
    print("\n🛡️ Creating Warranties...")
    warranties = []
    for data in WARRANTIES:
        w, _ = Warranty.objects.get_or_create(
            name=data["name"],
            defaults={
                "company": data["company"],
                "duration": data["duration"],
                "description": data["description"]
            }
        )
        warranties.append(w)
    print(f"✅ Created {len(warranties)} Warranties!")
    return warranties


def create_colors():
    print("\n🎨 Creating Colors...")
    # Base Colors
    base_colors = []
    for data in BASE_COLORS:
        bc, _ = BaseColor.objects.get_or_create(
            name=data["name"],
            defaults={"color": data["hex"]}
        )
        base_colors.append(bc)
    
    base_color_map = {bc.name: bc for bc in base_colors}

    # Colors
    colors = []
    for data in COLORS:
        bc = base_color_map.get(data["base"])
        c, _ = Color.objects.get_or_create(
            name=data["name"],
            defaults={
                "hex_code": data["hex"],
                "base_color": bc
            }
        )
        colors.append(c)
    print(f"✅ Created {len(base_colors)} Base Colors and {len(colors)} Colors!")
    return colors


def create_sizes():
    print("\n📏 Creating Sizes...")
    sizes = []
    for data in SIZES:
        s, _ = Size.objects.get_or_create(
            size=data["size"],
            number_size=data["size_num"],
            defaults={
                "size_numrical": data["size_numrical"],
                "category": data["category"]
            }
        )
        sizes.append(s)
    print(f"✅ Created {len(sizes)} Sizes!")
    return sizes


def create_users(count=60):
    print(f"\n👤 Creating {count} Users...")
    users = []
    # Create 1 admin
    admin, _ = User.objects.get_or_create(
        username="admin",
        defaults={
            "email": "admin@shop.com",
            "is_staff": True,
            "is_superuser": True
        }
    )
    admin.set_password("admin123")
    admin.save()
    users.append(admin)

    # Create regular users
    for i in range(count - 1):
        first = random.choice(FIRST_NAMES_FA)
        last = random.choice(LAST_NAMES_FA)
        username = f"{first.lower()}{last.lower()}{i}"
        email = f"{username}@example.com"
        user = User.objects.create_user(
            username=username,
            email=email,
            password="password123"
        )
        users.append(user)
    print(f"✅ Created {len(users)} Users!")
    return users


def create_profiles(users):
    print("\n👤 Creating Profiles...")
    for user in users:
        Profile.objects.update_or_create(
            user=user,
            defaults={
                "phone_number": random_fa_phone(),
                "is_phone_verified": random.choice([True, False]),
                "job": random.choice(["مهندس", "مدیر", "معلم", "طراح", "حسابدار", "دانشجو", None])
            }
        )
    print("✅ Created Profiles!")


def create_addresses(users):
    print("\n📍 Creating Addresses...")
    for user in users:
        province = random.choice(PROVINCES)
        city = random.choice(CITIES)
        ClientAddress.objects.create(
            user=user,
            title_address=f"{city}",
            province=province,
            city=city,
            full_address=random_address(),
            postcode=random_postcode()
        )
    print("✅ Created Addresses!")


def create_providers(users):
    print("\n🏪 Creating Providers...")
    # Disconnect signals temporarily
    post_save.disconnect(set_user_as_staff, sender=Provider)
    post_save.disconnect(assign_provider_permissions, sender=Provider)

    provider_users = users[1:5]  # Take 4 users as providers
    providers = []
    company_names = ["فروشگاه مد پوش", "فروشگاه کفش نوین", "فروشگاه اکسسوری شیک", "فروشگاه عطر و ادکلن"]
    for i, user in enumerate(provider_users):
        provider, _ = Provider.objects.get_or_create(
            user=user,
            defaults={
                "provider_type": random.choice(["individual", "company"]),
                "status": "active",
                "company_name": company_names[i],
                "email": f"provider{i}@shop.com",
                "phone_number": random_fa_phone(),
                "address": random_address(),
                "city": random.choice(CITIES),
                "is_verified": True,
                "is_active": True
            }
        )
        providers.append(provider)
    
    # Reconnect signals
    post_save.connect(set_user_as_staff, sender=Provider)
    post_save.connect(assign_provider_permissions, sender=Provider)
    print(f"✅ Created {len(providers)} Providers!")
    return providers


def create_products(categories, providers, brands, count=150):
    print(f"\n👕 Creating {count} Products...")
    cat_map = {c.name: c for c in categories}
    all_product_categories = []
    
    clothing_cats = ["تیشرت مردانه", "پیراهن مردانه", "شلوار مردانه", "ژاکت مردانه", "بلوز زنانه", "دامن زنانه", "شال و روسری"]
    shoe_cats = ["کفش مردانه", "کفش زنانه"]
    accessory_cats = ["کیف", "کمربند"]
    fragrance_cats = ["عطر مردانه", "عطر زنانه"]
    watch_cats = ["ساعت مردانه", "ساعت زنانه"]
    
    # Combine all valid categories that we have names for
    all_product_categories = clothing_cats + shoe_cats + accessory_cats + fragrance_cats + watch_cats
    valid_categories = [c for c in all_product_categories if c in cat_map]

    products = []
    product_id = 1

    while len(products) < count:
        # Choose a category
        cat_name = random.choice(valid_categories)
        
        if cat_name in ["تیشرت مردانه", "پیراهن مردانه", "شلوار مردانه", "ژاکت مردانه"]:
            name = random.choice(PRODUCT_NAMES_MEN)
        elif cat_name in ["بلوز زنانه", "دامن زنانه", "شال و روسری"]:
            name = random.choice(PRODUCT_NAMES_WOMEN)
        elif cat_name in shoe_cats:
            name = random.choice(PRODUCT_NAMES_SHOES)
        elif cat_name in accessory_cats:
            name = random.choice(PRODUCT_NAMES_ACCESSORIES)
        elif cat_name in fragrance_cats:
            name = random.choice(PRODUCT_NAMES_FRAGRANCES)
        elif cat_name in watch_cats:
            name = random.choice(PRODUCT_NAMES_WATCHES)
        else:
            continue  # Skip if no name fits
        
        full_name = f"{name} - مدل {product_id}"
        
        product = Product.objects.create(
            name=full_name,
            description=f"{full_name} با کیفیت عالی و طراحی شیک. مناسب برای استفاده روزمره.",
            is_active=True,
            provider=random.choice(providers)
        )
        product.categories.add(cat_map[cat_name])
        products.append(product)
        product_id += 1
    
    print(f"✅ Created {len(products)} Products!")
    return products


def create_product_packages(products, providers, warranties, brands, colors, sizes, count=700):
    print(f"\n📦 Creating {count} Product Packages...")
    packages = []
    per_product = max(1, count // len(products))

    clothing_categories = [
        "لباس مردانه", "لباس زنانه",
        "تیشرت مردانه", "پیراهن مردانه",
        "شلوار مردانه", "ژاکت مردانه",
        "بلوز زنانه", "دامن زنانه",
        "شال و روسری"
    ]

    shoe_categories = ["کفش مردانه", "کفش زنانه"]

    for product in products:
        # Find relevant categories for size/color/brand
        product_cat = product.categories.first()
        if not product_cat:
            continue
        
        product_type = product_cat.name

        for i in range(random.randint(1, per_product + 2)):
            if len(packages) >= count:
                break

            # Choose brand
            brand = random.choice(brands)

            # Choose warranty
            warranty = random.choice(warranties)

            # Choose color
            color = random.choice(colors) if random.random() > 0.1 else None

            # Choose size
            size = None
            if product_type in clothing_categories:
                size = random.choice([s for s in sizes if s.category == "clothing"])
            elif product_type in shoe_categories:
                size = random.choice([s for s in sizes if s.category == "shoes"])

            # Price
            base_price = 0
            if product_type in ["عطر مردانه", "عطر زنانه"]:
                base_price = random.randint(500000, 5000000)
            elif product_type in ["ساعت مردانه", "ساعت زنانه"]:
                base_price = random.randint(1000000, 10000000)
            elif product_type in ["کیف"]:
                base_price = random.randint(500000, 3000000)
            elif product_type in shoe_categories:
                base_price = random.randint(800000, 5000000)
            else:
                base_price = random.randint(200000, 2000000)

            discount = random.randint(0, 30)
            is_discount = random.choice([True, False])
            if not is_discount:
                discount = 0
            final_price = base_price if discount == 0 else int(base_price - (base_price * discount / 100))

            package = ProductPackage.objects.create(
                product=product,
                provider=random.choice(providers),
                waranty=warranty,
                brand=brand,
                color=color,
                size=size,
                quantity=random.randint(5, 200),
                weight=random.randint(100, 2000),
                is_active_package=True,
                price=base_price,
                final_price=final_price,
                discount=discount,
                is_active_discount=is_discount,
                sold_count=random.randint(0, 100),
                views_count=random.randint(10, 1000),
                rating=round(random.uniform(3, 5), 1)
            )
            packages.append(package)
    
    print(f"✅ Created {len(packages)} Product Packages!")
    return packages


def create_comments(users, products, count=500):
    print(f"\n💬 Creating {count} Comments...")
    comment_users = [u for u in users if not u.is_staff]
    comments = []
    for product in products:
        if len(comments) >= count:
            break
        for _ in range(random.randint(0, 5)):
            if len(comments) >= count:
                break
            comment = Comment.objects.create(
                user=random.choice(comment_users),
                product=product,
                text=random.choice(REVIEWS),
                rating=random.randint(3, 5),
                is_approved=random.choice([True, False])
            )
            comments.append(comment)
    print(f"✅ Created {len(comments)} Comments!")
    return comments


def create_cart_and_orders(users, product_packages, count=300):
    print(f"\n🛒 Creating {count} Orders with Carts...")
    regular_users = [u for u in users if not u.is_staff]
    orders_created = 0
    for user in regular_users:
        if orders_created >= count:
            break
        # Create cart
        cart = Cart.objects.create(
            user=user,
            is_paid=True,
            status="در حال انتظار"
        )
        # Add items
        item_count = random.randint(1, 5)
        for _ in range(item_count):
            package = random.choice(product_packages)
            CartItem.objects.create(
                cart=cart,
                package=package,
                count=random.randint(1, 3),
                final_price=package.final_price
            )
        # Create order
        address = ClientAddress.objects.filter(user=user).first()
        if address:
            try:
                Order.objects.create(
                    user=user,
                    cart=cart,
                    address=address,
                    order_number=str(uuid.uuid4()),
                    payment_method=random.choice(["online", "wallet", "cod"]),
                    payment_status="پرداخت شده",
                    status=random.choice(["در حال انتظار", "تأیید شده", "ارسال شده", "تحویل داده شده"]),
                    shipping_method=random.choice(["post", "tipax", "express"]),
                    shipping_cost=random.randint(15000, 50000),
                    total_price=cart.total_price()
                )
                orders_created += 1
            except Exception:
                pass
    print(f"✅ Created {orders_created} Orders!")


def create_home_content(brands):
    print("\n🏠 Creating Home Content...")
    # Sliders
    slider_titles = ["فروش ویژه بهار", "جدیدترین کلکسیون", "تخفیف تا ۵۰٪", "خرید اینترنتی آسان"]
    for i, title in enumerate(slider_titles):
        HomeSlider.objects.get_or_create(
            title=title,
            defaults={
                "subtitle": "برای مشاهده کلیک کنید",
                "active": True,
                "order": i
            }
        )
    # Banners
    banner_titles = ["ارسال رایگان برای خرید‌های بالای ۵۰۰ هزار تومان", "گارانتی اصالت", "پشتیبانی ۲۴ ساعته"]
    positions = ["top", "middle", "bottom"]
    sizes = ["full", "half", "third"]
    for i, title in enumerate(banner_titles):
        PromotionalBanner.objects.get_or_create(
            title=title,
            defaults={
                "active": True,
                "position": random.choice(positions),
                "size": random.choice(sizes),
                "order": i
            }
        )
    # Featured Brands
    for i, brand in enumerate(brands[:5]):
        FeaturedBrand.objects.get_or_create(
            brand=brand,
            defaults={"active": True, "order": i}
        )
    print("✅ Created Home Content!")


def create_site_settings():
    print("\n⚙️ Creating Site Settings...")
    SiteSettings.objects.get_or_create(
        site_name="فروشگاه مد و پوش",
        defaults={
            "site_url": "http://localhost",
            "email": "info@modopoush.com",
            "phone": "02112345678",
            "address": "تهران، خیابان ولیعصر، پلاک ۱۲۳",
            "footer_text": "© ۲۰۲۶ فروشگاه مد و پوش. همه حقوق محفوظ است.",
            "about_text": "فروشگاه اینترنتی مد و پوش با بیش از ۱۰ سال سابقه در زمینه فروش آنلاین لباس، کفش و اکسسوری.",
            "shipping_cost": 25000,
            "free_shipping_threshold": 500000,
            "tax_percentage": 9.0
        }
    )
    print("✅ Created Site Settings!")


def create_static_pages():
    print("\n📄 Creating Static Pages...")
    pages = [
        {"title": "درباره ما", "slug": "about-us", "content": "فروشگاه اینترنتی مد و پوش با بیش از ۱۰ سال سابقه در زمینه فروش آنلاین لباس، کفش و اکسسوری."},
        {"title": "قوانین و مقررات", "slug": "terms", "content": "تمام قوانین و مقررات خرید از فروشگاه مد و پوش را در این صفحه مطالعه کنید."},
        {"title": "تماس با ما", "slug": "contact-us", "content": "آدرس: تهران، خیابان ولیعصر. شماره تماس: ۰۲۱۱۲۳۴۵۶۷۸. ایمیل: info@modopoush.com"},
        {"title": "سوالات متداول", "slug": "faq", "content": "پاسخ به سوالات متداول شما درباره خرید، ارسال و خدمات پس از فروش."},
    ]
    for data in pages:
        StaticPage.objects.get_or_create(
            slug=data["slug"],
            defaults={
                "title": data["title"],
                "content": data["content"],
                "active": True
            }
        )
    print("✅ Created Static Pages!")


def create_articles():
    print("\n📚 Creating Articles...")
    articles_data = [
        {"title": "۱۰ راهکار برای خرید لباس با بودجه محدود", "content": "در این مقاله به شما ۱۰ راهکار مفید برای خرید لباس با بودجه محدود را معرفی می‌کنیم..."},
        {"title": "آخرین ترندهای فشن بهار ۱۴۰۵", "content": "ترندهای فشن بهار ۱۴۰۵ چه هستند؟ چه رنگ‌ها و مدل‌هایی در این فصل مد شده‌اند؟"},
        {"title": "چگونه کفش ورزشی مناسب انتخاب کنیم؟", "content": "انتخاب کفش ورزشی مناسب برای ورزش و فعالیت روزمره بسیار مهم است. در این مقاله راهنمای انتخاب کفش ورزشی مناسب را مطالعه کنید..."},
        {"title": "راهنمای نگهداری از عطر", "content": "چگونه عطر خود را نگهداری کنیم تا کیفیت و رایحه آن را حفظ کند؟ نکات مهم در این مقاله..."},
    ]
    for data in articles_data:
        Article.objects.get_or_create(
            title=data["title"],
            defaults={
                "content": data["content"],
                "short_description": data["content"][:100],
                "is_published": True
            }
        )
    print("✅ Created Articles!")


def create_notifications(users):
    print("\n🔔 Creating Notifications...")
    regular_users = [u for u in users if not u.is_staff]
    notification_types = ["info", "success", "warning", "danger"]
    for user in regular_users:
        for i in range(random.randint(1, 3)):
            Notification.objects.create(
                user=user,
                title=f"اعلان شماره {i+1}",
                message=f"این یک اعلان نمونه برای {user.username} است.",
                notification_type=random.choice(notification_types),
                is_read=random.choice([True, False])
            )
    print("✅ Created Notifications!")


def create_favourites(users, products):
    print("\n❤️ Creating Favourite Products...")
    regular_users = [u for u in users if not u.is_staff]
    for user in regular_users:
        fav, _ = FavouriteProducts.objects.get_or_create(user=user)
        fav.products.add(*random.sample(products, min(5, len(products))))
    print("✅ Created Favourites!")


def create_support_tickets(users):
    print("\n💬 Creating Support Tickets...")
    regular_users = [u for u in users if not u.is_staff]
    for user in regular_users[:15]:
        for i in range(random.randint(0, 2)):
            ticket = SupportTicket.objects.create(
                user=user,
                subject=f"تیکت پشتیبانی {i+1} برای {user.username}",
                message="این یک پیام تیکت پشتیبانی نمونه است.",
                department=random.choice(["general", "technical", "billing", "sales"]),
                priority=random.choice(["low", "medium", "high", "urgent"]),
                status=random.choice(["pending", "in_progress", "resolved", "closed"])
            )
            for j in range(random.randint(0, 2)):
                TicketReply.objects.create(
                    ticket=ticket,
                    user=random.choice(users),
                    message="این یک پاسخ تیکت نمونه است.",
                    is_staff_reply=random.choice([True, False])
                )
    print("✅ Created Support Tickets!")


def create_user_coupons(users):
    print("\n🎫 Creating User Coupons...")
    regular_users = [u for u in users if not u.is_staff]
    for user in regular_users[:20]:
        for i in range(random.randint(0, 2)):
            UserCoupon.objects.create(
                user=user,
                code=f"COUPON{user.id}{i}",
                discount=random.randint(5, 20),
                is_active=random.choice([True, False])
            )
    print("✅ Created User Coupons!")


def main():
    print("="*50)
    print("🚀 Starting Real Fashion Store Seed")
    print("="*50)

    clear_all_data()

    # Category & Brand
    base_categories = create_base_categories()
    categories = create_categories(base_categories)
    brands = create_brands(categories)

    # Product & Attribute
    warranties = create_warranties()
    colors = create_colors()
    sizes = create_sizes()

    # User & Provider
    users = create_users(count=60)
    create_profiles(users)
    create_addresses(users)
    providers = create_providers(users)

    # Product Content
    products = create_products(categories, providers, brands, count=150)
    product_packages = create_product_packages(products, providers, warranties, brands, colors, sizes, count=700)

    # Reviews
    create_comments(users, products, count=500)

    # Cart & Order
    create_cart_and_orders(users, product_packages, count=300)

    # Site Content
    create_home_content(brands)
    create_site_settings()
    create_static_pages()
    create_articles()

    # Other Content
    create_notifications(users)
    create_favourites(users, products)
    create_support_tickets(users)
    create_user_coupons(users)

    print("\n" + "="*50)
    print("✅ ALL SEEDING COMPLETED!")
    print("="*50)


if __name__ == "__main__":
    main()

