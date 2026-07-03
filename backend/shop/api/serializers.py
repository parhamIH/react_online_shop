from django.conf import settings
from rest_framework import serializers

from shop.account.models import ClientAddress, FavouriteProducts, Profile, Notification, UserCoupon
from shop.articles.models import Article
from shop.cart.models import Cart, CartItem
from shop.categories.models import BaseCategories, Category
from shop.home.models import FeaturedBrand, HomeSlider, PromotionalBanner
from shop.products.models import Gallery, Product, ProductPackage
from shop.public.models import Brand
from shop.reviews.models import Comment
from shop.order.models import Order
from shop.support.models import SupportTicket, TicketReply


def absolute_media_url(request, file_field):
    if not file_field:
        return None
    return request.build_absolute_uri(file_field.url) if request else file_field.url


class HomeSliderSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = HomeSlider
        fields = ["id", "title", "subtitle", "image", "link", "order"]

    def get_image(self, obj):
        return absolute_media_url(self.context.get("request"), obj.image)


class PromotionalBannerSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = PromotionalBanner
        fields = ["id", "title", "image", "link", "position", "size", "order"]

    def get_image(self, obj):
        return absolute_media_url(self.context.get("request"), obj.image)


class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    productCount = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "en_name", "description", "image", "productCount"]

    def get_image(self, obj):
        return absolute_media_url(self.context.get("request"), obj.image)

    def get_productCount(self, obj):
        return Product.objects.filter(categories=obj, is_active=True).count()


class BaseCategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    productCount = serializers.SerializerMethodField()

    class Meta:
        model = BaseCategories
        fields = ["id", "name", "en_name", "description", "image", "productCount"]

    def get_image(self, obj):
        return absolute_media_url(self.context.get("request"), obj.image)

    def get_productCount(self, obj):
        return Product.objects.filter(categories__base_catgory=obj, is_active=True).distinct().count()


class BrandSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()
    productCount = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()

    class Meta:
        model = Brand
        fields = ["id", "name", "en_name", "logo", "productCount", "category"]

    def get_logo(self, obj):
        return absolute_media_url(self.context.get("request"), obj.logo)

    def get_productCount(self, obj):
        return ProductPackage.objects.filter(brand=obj, is_active_package=True).values("product").distinct().count()

    def get_category(self, obj):
        first = obj.category.first()
        return first.en_name if first else None


class FeaturedBrandSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)

    class Meta:
        model = FeaturedBrand
        fields = ["id", "brand", "order"]


class ProductPackageSerializer(serializers.ModelSerializer):
    color = serializers.CharField(source="color.name", default=None)
    size = serializers.CharField(source="size.size", default=None)
    brand = serializers.CharField(source="brand.en_name", default=None)

    class Meta:
        model = ProductPackage
        fields = [
            "id",
            "price",
            "final_price",
            "discount",
            "is_active_discount",
            "is_active_package",
            "quantity",
            "color",
            "size",
            "brand",
            "attributs",
            "rating",
            "sold_count",
        ]


class ProductListSerializer(serializers.ModelSerializer):
    price = serializers.SerializerMethodField()
    originalPrice = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    brand = serializers.SerializerMethodField()
    brandId = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()
    inStock = serializers.SerializerMethodField()
    isNew = serializers.SerializerMethodField()
    isOffer = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "price",
            "originalPrice",
            "image",
            "category",
            "brand",
            "brandId",
            "rating",
            "reviews",
            "inStock",
            "isNew",
            "isOffer",
        ]

    def _primary_package(self, obj):
        packages = getattr(obj, "_active_packages", None)
        if packages is None:
            packages = list(
                obj.product_packages.filter(is_active_package=True).select_related("brand", "color", "size")
            )
        return packages[0] if packages else None

    def get_price(self, obj):
        package = self._primary_package(obj)
        return package.final_price if package else 0

    def get_originalPrice(self, obj):
        package = self._primary_package(obj)
        if package and package.is_active_discount and package.discount:
            return package.price
        return None

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            return absolute_media_url(request, obj.image)
        gallery = obj.gallery_set.first()
        return absolute_media_url(request, gallery.image) if gallery else None

    def get_category(self, obj):
        category = obj.categories.first()
        return category.en_name if category else None

    def get_brand(self, obj):
        package = self._primary_package(obj)
        if package and package.brand:
            return package.brand.en_name
        return None

    def get_brandId(self, obj):
        package = self._primary_package(obj)
        return package.brand_id if package and package.brand_id else None

    def get_rating(self, obj):
        package = self._primary_package(obj)
        return package.rating if package else 0

    def get_reviews(self, obj):
        return Comment.objects.filter(product=obj, is_approved=True).count()

    def get_inStock(self, obj):
        return obj.product_packages.filter(is_active_package=True, quantity__gt=0).exists()

    def get_isNew(self, obj):
        from django.utils import timezone
        from datetime import timedelta

        return obj.created_date >= timezone.now() - timedelta(days=30)

    def get_isOffer(self, obj):
        return obj.product_packages.filter(is_active_package=True, is_active_discount=True).exists()


class ProductDetailSerializer(ProductListSerializer):
    images = serializers.SerializerMethodField()
    attributes = serializers.SerializerMethodField()
    packages = ProductPackageSerializer(source="product_packages", many=True, read_only=True)
    videoUrl = serializers.SerializerMethodField()

    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + ["images", "attributes", "packages", "videoUrl"]

    def get_images(self, obj):
        request = self.context.get("request")
        images = []
        if obj.image:
            images.append(absolute_media_url(request, obj.image))
        for gallery in obj.gallery_set.all():
            url = absolute_media_url(request, gallery.image)
            if url and url not in images:
                images.append(url)
        return images

    def get_attributes(self, obj):
        colors = set()
        sizes = set()
        for package in obj.product_packages.filter(is_active_package=True):
            if package.color:
                colors.add(package.color.name)
            if package.size and package.size.size:
                sizes.add(package.size.size)
        attrs = {}
        if colors:
            attrs["Color"] = sorted(colors)
        if sizes:
            attrs["Size"] = sorted(sizes)
        return attrs

    def get_videoUrl(self, obj):
        return None


class ArticleListSerializer(serializers.ModelSerializer):
    excerpt = serializers.CharField(source="short_description")
    image = serializers.SerializerMethodField()
    date = serializers.DateTimeField(source="created_at", format="%Y-%m-%d")
    readTime = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField()
    hasVideo = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "image",
            "category",
            "author",
            "date",
            "readTime",
            "hasVideo",
        ]

    def get_image(self, obj):
        return absolute_media_url(self.context.get("request"), obj.image)

    def get_readTime(self, obj):
        words = len(obj.content.split()) if obj.content else 0
        minutes = max(1, round(words / 200))
        return f"{minutes} min"

    def get_category(self, obj):
        return "General"

    def get_author(self, obj):
        return "Admin"

    def get_hasVideo(self, obj):
        return False


class ArticleDetailSerializer(ArticleListSerializer):
    class Meta(ArticleListSerializer.Meta):
        fields = ArticleListSerializer.Meta.fields + ["content", "meta_title", "meta_description"]


class CartItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ["id", "product", "count", "price", "total"]

    def get_product(self, obj):
        return ProductListSerializer(obj.package.product, context=self.context).data

    def get_price(self, obj):
        return obj.get_price()

    def get_total(self, obj):
        return obj.total_price()


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(source="cartitem_set", many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "cart_number", "status", "is_paid", "items", "total"]

    def get_total(self, obj):
        return obj.total_price()


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    first_name = serializers.CharField(source="user.first_name", required=False, allow_blank=True)
    last_name = serializers.CharField(source="user.last_name", required=False, allow_blank=True)
    date_joined = serializers.DateTimeField(source="user.date_joined", read_only=True)
    avatar = serializers.SerializerMethodField()
    stats = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "national_id",
            "birth_date",
            "job",
            "is_phone_verified",
            "date_joined",
            "avatar",
            "stats",
        ]

    def get_avatar(self, obj):
        return absolute_media_url(self.context.get("request"), obj.avatar)

    def get_stats(self, obj):
        from shop.order.models import Order
        from shop.account.models import ClientAddress, FavouriteProducts
        from shop.support.models import SupportTicket
        
        total_orders = Order.objects.filter(user=obj.user).count()
        active_orders = Order.objects.filter(user=obj.user, status__in=['در حال انتظار', 'در حال پردازش', 'ارسال شده']).count()
        saved_addresses = ClientAddress.objects.filter(user=obj.user).count()
        try:
            fav = FavouriteProducts.objects.get(user=obj.user)
            favorite_products = fav.products.count()
        except FavouriteProducts.DoesNotExist:
            favorite_products = 0
        support_tickets = SupportTicket.objects.filter(user=obj.user).count()
        
        return {
            "total_orders": total_orders,
            "active_orders": active_orders,
            "saved_addresses": saved_addresses,
            "favorite_products": favorite_products,
            "support_tickets": support_tickets,
        }

    def update(self, instance, validated_data):
        # Update user fields
        user_data = validated_data.pop('user', {})
        user = instance.user
        if 'first_name' in user_data:
            user.first_name = user_data['first_name']
        if 'last_name' in user_data:
            user.last_name = user_data['last_name']
        user.save()
        
        # Update profile fields
        return super().update(instance, validated_data)


class ClientAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientAddress
        fields = ["id", "title_address", "province", "city", "full_address", "postcode"]


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    phone_number = serializers.CharField(max_length=15, required=False, allow_blank=True)


class CommentSerializer(serializers.ModelSerializer):
    productName = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "product", "productName", "text", "rating", "is_approved", "created_at"]


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "title", "message", "notification_type", "is_read", "related_url", "created_at"]


class FavouriteProductsSerializer(serializers.ModelSerializer):
    products = ProductListSerializer(many=True, read_only=True)

    class Meta:
        model = FavouriteProducts
        fields = ["id", "products", "created_at", "updated_at"]


class UserCouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCoupon
        fields = ["id", "code", "discount", "is_active", "created_at", "expire_at"]


class TicketReplySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = TicketReply
        fields = ["id", "message", "attachment", "is_staff_reply", "created_at", "username"]


class SupportTicketSerializer(serializers.ModelSerializer):
    replies = TicketReplySerializer(many=True, read_only=True)

    class Meta:
        model = SupportTicket
        fields = [
            "id",
            "subject",
            "message",
            "department",
            "priority",
            "status",
            "created_at",
            "updated_at",
            "replies"
        ]


class OrderSerializer(serializers.ModelSerializer):
    address = ClientAddressSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "order_date",
            "payment_status",
            "status",
            "shipping_method",
            "shipping_cost",
            "total_price",
            "address",
            "shipping_date",
            "delivery_date",
            "jalali_delivery_date"
        ]