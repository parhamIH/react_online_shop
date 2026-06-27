
import os
import django
import random
from faker import Faker
from django.utils.text import slugify
from decimal import Decimal

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

fake = Faker('fa_IR')  # Using Persian locale
fake_en = Faker('en_US')

def create_users(n=10):
    users = []
    for _ in range(n):
        username = fake.user_name()
        email = fake.email()
        user = User.objects.create_user(
            username=username,
            email=email,
            password='password123'
        )
        users.append(user)
    return users

def create_profiles(users):
    for user in users:
        Profile.objects.update_or_create(
            user=user,
            defaults={
                'phone_number': f'09{random.randint(100000000, 999999999)}',
                'is_phone_verified': random.choice([True, False]),
                'job': fake.job(),
            }
        )

def create_addresses(users):
    provinces = ['تهران', 'اصفهان', 'شیراز', 'مشهد', 'تبریز', 'اهواز', 'قم', 'یزد', 'کرمان', 'اراک']
    for user in users:
        ClientAddress.objects.create(
            user=user,
            title_address=fake.word(),
            province=random.choice(provinces),
            city=fake.city(),
            full_address=fake.address(),
            postcode=str(random.randint(1000000000, 9999999999))
        )

def create_base_categories():
    base_cats = [
        {'name': 'الکترونیک', 'en_name': 'Electronics', 'description': 'محصولات الکترونیکی'},
        {'name': 'پوشاک', 'en_name': 'Clothing', 'description': 'لباس و پوشاک'},
        {'name': 'خانه و آشپزخانه', 'en_name': 'Home & Kitchen', 'description': 'محصولات خانه و آشپزخانه'},
        {'name': 'ورزشی', 'en_name': 'Sports', 'description': 'تجهیزات ورزشی'},
        {'name': 'کتاب', 'en_name': 'Books', 'description': 'کتاب‌ها و نشریات'},
    ]
    base_categories = []
    for cat in base_cats:
        bc, _ = BaseCategories.objects.get_or_create(
            name=cat['name'],
            defaults={
                'en_name': cat['en_name'],
                'description': cat['description']
            }
        )
        base_categories.append(bc)
    return base_categories

def create_categories(base_categories):
    categories = []
    category_data = [
        {'base': 'الکترونیک', 'name': 'گوشی موبایل', 'en_name': 'Mobile Phones'},
        {'base': 'الکترونیک', 'name': 'لپ‌تاپ', 'en_name': 'Laptops'},
        {'base': 'الکترونیک', 'name': 'تلویزیون', 'en_name': 'TVs'},
        {'base': 'پوشاک', 'name': 'پیراهن', 'en_name': 'Shirts'},
        {'base': 'پوشاک', 'name': 'شلوار', 'en_name': 'Pants'},
        {'base': 'خانه و آشپزخانه', 'name': 'ظروف آشپزخانه', 'en_name': 'Kitchenware'},
        {'base': 'ورزشی', 'name': 'کفش ورزشی', 'en_name': 'Sports Shoes'},
    ]
    base_cat_map = {bc.name: bc for bc in base_categories}
    for data in category_data:
        base_cat = base_cat_map.get(data['base'])
        if base_cat:
            cat, _ = Category.objects.get_or_create(
                name=data['name'],
                defaults={
                    'en_name': data['en_name'],
                    'base_catgory': base_cat,
                    'description': fake.text()
                }
            )
            categories.append(cat)
    return categories

def create_brands(categories):
    brands_data = [
        {'name': 'سامسونگ', 'en_name': 'Samsung'},
        {'name': 'اپل', 'en_name': 'Apple'},
        {'name': 'هوآوی', 'en_name': 'Huawei'},
        {'name': 'نایک', 'en_name': 'Nike'},
        {'name': 'آدیداس', 'en_name': 'Adidas'},
        {'name': 'پوما', 'en_name': 'Puma'},
    ]
    brands = []
    for data in brands_data:
        brand, _ = Brand.objects.get_or_create(
            name=data['name'],
            defaults={'en_name': data['en_name']}
        )
        brand.category.add(*random.sample(categories, k=min(2, len(categories))))
        brands.append(brand)
    return brands

def create_warranties():
    warranties = []
    for _ in range(5):
        w, _ = Warranty.objects.get_or_create(
            name=fake.word(),
            defaults={
                'company': fake.company(),
                'duration': random.randint(6, 24),
                'description': fake.text()
            }
        )
        warranties.append(w)
    return warranties

def create_colors():
    base_colors = []
    colors_data = [
        ('سفید', '#FFFFFF'),
        ('مشکی', '#000000'),
        ('قرمز', '#FF0000'),
        ('آبی', '#0000FF'),
        ('سبز', '#008000'),
        ('زرد', '#FFFF00'),
    ]
    for name, hex_code in colors_data:
        bc, _ = BaseColor.objects.get_or_create(
            name=name,
            defaults={'color': hex_code}
        )
        base_colors.append(bc)
        
    colors = []
    for name, hex_code in colors_data:
        c, _ = Color.objects.get_or_create(
            name=name,
            defaults={
                'hex_code': hex_code,
                'base_color': random.choice(base_colors)
            }
        )
        colors.append(c)
    return colors

def create_sizes():
    sizes = []
    size_choices = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    category_choices = ['clothing', 'shoes', 'accessories']
    for size in size_choices:
        s, _ = Size.objects.get_or_create(
            size=size,
            defaults={
                'size_numrical': size,
                'category': random.choice(category_choices)
            }
        )
        sizes.append(s)
    # Add numerical sizes for shoes
    for num in range(38, 46):
        s, _ = Size.objects.get_or_create(
            number_size=num,
            defaults={
                'size_numrical': str(num),
                'category': 'shoes'
            }
        )
        sizes.append(s)
    return sizes

def create_providers(users):
    providers = []
    provider_types = ['individual', 'company']
    statuses = ['pending', 'active', 'suspended', 'rejected']
    for i in range(min(3, len(users))):
        user = users[i]
        provider, _ = Provider.objects.get_or_create(
            user=user,
            defaults={
                'provider_type': random.choice(provider_types),
                'status': 'active',
                'company_name': fake.company() + str(i),
                'email': fake.email(),
                'phone_number': f'021{random.randint(10000000, 99999999)}',
                'address': fake.address(),
                'city': fake.city(),
                'is_active': True,
                'is_verified': True
            }
        )
        providers.append(provider)
    return providers

def create_products(categories, providers, brands):
    products = []
    for _ in range(20):
        name = fake.word() + ' ' + fake.word()
        p, _ = Product.objects.get_or_create(
            name=name,
            defaults={
                'description': fake.text(),
                'is_active': True,
                'provider': random.choice(providers)
            }
        )
        p.categories.add(*random.sample(categories, k=min(2, len(categories))))
        products.append(p)
    return products

def create_product_packages(products, providers, warranties, brands, colors, sizes):
    packages = []
    for product in products:
        for _ in range(random.randint(1, 3)):
            pp = ProductPackage.objects.create(
                product=product,
                provider=random.choice(providers),
                waranty=random.choice(warranties),
                brand=random.choice(brands),
                color=random.choice(colors) if random.random() > 0.3 else None,
                size=random.choice(sizes) if random.random() > 0.3 else None,
                quantity=random.randint(10, 200),
                weight=random.randint(100, 5000),
                is_active_package=True,
                price=random.randint(100000, 10000000),
                discount=random.randint(0, 50),
                is_active_discount=random.choice([True, False]),
                sold_count=random.randint(0, 500),
                views_count=random.randint(0, 1000),
                rating=round(random.uniform(0, 5), 1)
            )
            packages.append(pp)
    return packages

def create_articles(n=5):
    articles = []
    for _ in range(n):
        title = fake.sentence()
        a = Article.objects.create(
            title=title,
            slug=slugify(title, allow_unicode=True),
            content=fake.text(max_nb_chars=1000),
            short_description=fake.text(max_nb_chars=200),
            is_published=True
        )
        articles.append(a)
    return articles

def create_comments(users, products):
    for product in products:
        for _ in range(random.randint(1, 5)):
            Comment.objects.create(
                user=random.choice(users),
                product=product,
                text=fake.text(),
                rating=random.randint(1, 5),
                is_approved=random.choice([True, False])
            )

def create_cart_and_orders(users, product_packages):
    for user in users:
        cart = Cart.objects.create(user=user, is_paid=random.choice([True, False]))
        for _ in range(random.randint(1, 4)):
            CartItem.objects.create(
                cart=cart,
                package=random.choice(product_packages),
                count=random.randint(1, 5)
            )
        if cart.is_paid:
            address = ClientAddress.objects.filter(user=user).first()
            if address:
                Order.objects.create(
                    user=user,
                    cart=cart,
                    address=address,
                    payment_method='online',
                    payment_status='پرداخت شده',
                    status='تأیید شده',
                    shipping_method=random.choice(['post', 'tipax', 'express']),
                    shipping_cost=random.randint(10000, 50000),
                    total_price=cart.total_price()
                )

def create_notifications(users):
    types = ['info', 'success', 'warning', 'danger']
    for user in users:
        for _ in range(random.randint(0, 3)):
            Notification.objects.create(
                user=user,
                title=fake.sentence(),
                message=fake.text(),
                notification_type=random.choice(types),
                is_read=random.choice([True, False])
            )

def create_favorites(users, products):
    for user in users:
        fav, _ = FavouriteProducts.objects.get_or_create(user=user)
        fav.products.add(*random.sample(products, k=min(5, len(products))))

def create_site_settings():
    SiteSettings.objects.get_or_create(
        site_name='فروشگاه من',
        defaults={
            'site_url': 'http://localhost:8000',
            'email': 'info@example.com',
            'phone': '02112345678',
            'address': fake.address(),
            'footer_text': '© 2024 فروشگاه من',
            'about_text': fake.text(max_nb_chars=500),
            'shipping_cost': 20000,
            'free_shipping_threshold': 500000,
            'tax_percentage': 9.0
        }
    )

def create_static_pages():
    pages = [
        {'title': 'درباره ما', 'slug': 'about-us', 'content': fake.text(max_nb_chars=1000)},
        {'title': 'قوانین و مقررات', 'slug': 'terms', 'content': fake.text(max_nb_chars=1000)},
        {'title': 'تماس با ما', 'slug': 'contact-us', 'content': fake.text(max_nb_chars=1000)},
    ]
    for page in pages:
        StaticPage.objects.get_or_create(
            slug=page['slug'],
            defaults={
                'title': page['title'],
                'content': page['content']
            }
        )

def main():
    print("Starting seed...")
    
    # Create basic data
    print("Creating users...")
    users = create_users()
    
    print("Creating profiles...")
    create_profiles(users)
    
    print("Creating addresses...")
    create_addresses(users)
    
    print("Creating base categories...")
    base_categories = create_base_categories()
    
    print("Creating categories...")
    categories = create_categories(base_categories)
    
    print("Creating brands...")
    brands = create_brands(categories)
    
    print("Creating warranties...")
    warranties = create_warranties()
    
    print("Creating colors...")
    colors = create_colors()
    
    print("Creating sizes...")
    sizes = create_sizes()
    
    print("Creating providers...")
    providers = create_providers(users)
    
    print("Creating products...")
    products = create_products(categories, providers, brands)
    
    print("Creating product packages...")
    product_packages = create_product_packages(products, providers, warranties, brands, colors, sizes)
    
    print("Creating articles...")
    create_articles()
    
    print("Creating comments...")
    create_comments(users, products)
    
    print("Creating cart and orders...")
    create_cart_and_orders(users, product_packages)
    
    print("Creating notifications...")
    create_notifications(users)
    
    print("Creating favorites...")
    create_favorites(users, products)
    
    print("Creating site settings...")
    create_site_settings()
    
    print("Creating static pages...")
    create_static_pages()
    
    print("Seed complete!")

if __name__ == '__main__':
    main()

