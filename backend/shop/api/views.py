from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Prefetch, Q
from rest_framework import generics, permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from shop.account.models import ClientAddress, Profile, Notification, FavouriteProducts, UserCoupon
from shop.articles.models import Article
from shop.cart.models import Cart, CartItem
from shop.categories.models import BaseCategories, Category
from shop.home.models import FeaturedBrand, HomeSlider, PromotionalBanner
from shop.products.models import Product, ProductPackage
from shop.public.models import Brand
from shop.order.models import Order
from shop.support.models import SupportTicket, TicketReply
from shop.reviews.models import Comment

from .serializers import (
    ArticleDetailSerializer,
    ArticleListSerializer,
    BaseCategorySerializer,
    BrandSerializer,
    CartItemSerializer,
    CartSerializer,
    CategorySerializer,
    ClientAddressSerializer,
    FeaturedBrandSerializer,
    HomeSliderSerializer,
    ProductDetailSerializer,
    ProductListSerializer,
    ProfileSerializer,
    PromotionalBannerSerializer,
    RegisterSerializer,
    CommentSerializer,
    NotificationSerializer,
    FavouriteProductsSerializer,
    UserCouponSerializer,
    SupportTicketSerializer,
    TicketReplySerializer,
    OrderSerializer,
)


class HomeAPIView(APIView):
    def get(self, request):
        sliders = HomeSlider.objects.filter(active=True)
        banners = PromotionalBanner.objects.filter(active=True)
        featured_brands = FeaturedBrand.objects.filter(active=True).select_related("brand")
        return Response(
            {
                "banners": HomeSliderSerializer(sliders, many=True, context={"request": request}).data,
                "promotionalBanners": PromotionalBannerSerializer(
                    banners, many=True, context={"request": request}
                ).data,
                "featuredBrands": FeaturedBrandSerializer(
                    featured_brands, many=True, context={"request": request}
                ).data,
            }
        )


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class BaseCategoryListView(generics.ListAPIView):
    serializer_class = BaseCategorySerializer
    queryset = BaseCategories.objects.all()


class BrandListView(generics.ListAPIView):
    serializer_class = BrandSerializer
    queryset = Brand.objects.all()


class BrandDetailView(generics.RetrieveAPIView):
    serializer_class = BrandSerializer
    queryset = Brand.objects.all()


class ProductQuerysetMixin:
    def get_queryset(self):
        active_packages = ProductPackage.objects.filter(is_active_package=True).select_related(
            "brand", "color", "size"
        )
        return (
            Product.objects.filter(is_active=True)
            .prefetch_related(
                "categories",
                "gallery_set",
                Prefetch("product_packages", queryset=active_packages, to_attr="_active_packages"),
            )
            .distinct()
        )


class ProductListView(ProductQuerysetMixin, generics.ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get("category")
        brand = self.request.query_params.get("brand")
        search = self.request.query_params.get("search")
        orderby = self.request.query_params.get("orderby")

        if category:
            queryset = queryset.filter(
                Q(categories__en_name__iexact=category) | Q(categories__name__iexact=category)
            )
        if brand:
            queryset = queryset.filter(product_packages__brand_id=brand, product_packages__is_active_package=True)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(description__icontains=search)
                | Q(categories__en_name__icontains=search)
                | Q(product_packages__brand__en_name__icontains=search)
            )

        if orderby == "higher-price":
            queryset = queryset.order_by("-product_packages__final_price")
        elif orderby == "lower-price":
            queryset = queryset.order_by("product_packages__final_price")
        elif orderby == "date":
            queryset = queryset.order_by("-created_date")
        else:
            queryset = queryset.order_by("-created_date")

        return queryset.distinct()


class ProductDetailView(ProductQuerysetMixin, generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    lookup_field = "pk"


class ProductOffersView(ProductQuerysetMixin, generics.ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .filter(product_packages__is_active_discount=True, product_packages__is_active_package=True)
            .distinct()
        )


class ProductNewArrivalsView(ProductQuerysetMixin, generics.ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        from django.utils import timezone
        from datetime import timedelta

        cutoff = timezone.now() - timedelta(days=30)
        return super().get_queryset().filter(created_date__gte=cutoff)


class ProductRelatedView(ProductQuerysetMixin, generics.ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        product = Product.objects.filter(pk=self.kwargs["pk"], is_active=True).first()
        if not product:
            return Product.objects.none()
        category_ids = product.categories.values_list("id", flat=True)
        return (
            super()
            .get_queryset()
            .filter(categories__in=category_ids)
            .exclude(pk=product.pk)
            .distinct()[:4]
        )


class ArticleListView(generics.ListAPIView):
    serializer_class = ArticleListSerializer
    queryset = Article.objects.filter(is_published=True)


class ArticleDetailView(generics.RetrieveAPIView):
    serializer_class = ArticleDetailSerializer
    queryset = Article.objects.filter(is_published=True)
    lookup_field = "pk"


class RegisterAPIView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        if User.objects.filter(username=data["username"]).exists():
            return Response({"detail": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=data["email"]).exists():
            return Response({"detail": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=data["username"],
            email=data["email"],
            password=data["password"],
        )
        Profile.objects.get_or_create(user=user)
        if data.get("phone_number"):
            profile = user.profile
            profile.phone_number = data["phone_number"]
            profile.save()

        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "username": user.username}, status=status.HTTP_201_CREATED)


class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if not user:
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "username": user.username})


class LogoutAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response({"detail": "Logged out."})


class ProfileAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfileSerializer

    def get_object(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile

    def update(self, request, *args, **kwargs):
        # Handle file upload for avatar
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        
        # Update user first name and last name
        if 'first_name' in request.data:
            request.user.first_name = request.data['first_name']
        if 'last_name' in request.data:
            request.user.last_name = request.data['last_name']
        request.user.save()
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
        
        return Response(serializer.data)


class AddressListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ClientAddressSerializer

    def get_queryset(self):
        return ClientAddress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ClientAddressSerializer

    def get_queryset(self):
        return ClientAddress.objects.filter(user=self.request.user)


class CartMixin:
    def get_or_create_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user, is_paid=False)
        return cart


class CartDetailView(CartMixin, APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart = self.get_or_create_cart(request.user)
        return Response(CartSerializer(cart, context={"request": request}).data)


class CartAddItemView(CartMixin, APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        package_id = request.data.get("package_id")
        count = int(request.data.get("count", 1))
        package = ProductPackage.objects.filter(pk=package_id, is_active_package=True).first()
        if not package:
            return Response({"detail": "Package not found."}, status=status.HTTP_404_NOT_FOUND)

        if package.quantity <= 0:
            return Response({"detail": "This product is out of stock."}, status=status.HTTP_400_BAD_REQUEST)

        if count <= 0:
            return Response({"detail": "Count must be greater than zero."}, status=status.HTTP_400_BAD_REQUEST)

        if count > package.quantity:
            return Response({"detail": f"Only {package.quantity} items available in stock."}, status=status.HTTP_400_BAD_REQUEST)

        cart = self.get_or_create_cart(request.user)
        item, created = CartItem.objects.get_or_create(cart=cart, package=package, defaults={"count": count})
        if not created:
            new_count = item.count + count
            if new_count > package.quantity:
                return Response({"detail": f"Only {package.quantity} items available in stock (you already have {item.count} in cart)."}, status=status.HTTP_400_BAD_REQUEST)
            item.count = new_count
            item.save()

        return Response(CartItemSerializer(item, context={"request": request}).data, status=status.HTTP_201_CREATED)


class CartUpdateItemView(CartMixin, APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, item_id):
        cart = self.get_or_create_cart(request.user)
        item = CartItem.objects.filter(pk=item_id, cart=cart).first()
        if not item:
            return Response({"detail": "Item not found."}, status=status.HTTP_404_NOT_FOUND)

        count = request.data.get("count")
        if count is not None:
            count = int(count)
            if count <= 0:
                item.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            
            package = item.package
            if count > package.quantity:
                return Response({"detail": f"Only {package.quantity} items available in stock."}, status=status.HTTP_400_BAD_REQUEST)
            
            item.count = count
            item.save()

        return Response(CartItemSerializer(item, context={"request": request}).data)


class CartRemoveItemView(CartMixin, APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, item_id):
        cart = self.get_or_create_cart(request.user)
        deleted, _ = CartItem.objects.filter(pk=item_id, cart=cart).delete()
        if not deleted:
            return Response({"detail": "Item not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrderListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-order_date")


class OrderDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class CommentListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CommentSerializer

    def get_queryset(self):
        return Comment.objects.filter(user=self.request.user).order_by("-created_at")


class NotificationListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by("-created_at")


class FavouriteProductsView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FavouriteProductsSerializer

    def get_object(self):
        fav, _ = FavouriteProducts.objects.get_or_create(user=self.request.user)
        return fav


class UserCouponListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserCouponSerializer

    def get_queryset(self):
        return UserCoupon.objects.filter(user=self.request.user).order_by("-created_at")


class SupportTicketListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SupportTicketSerializer

    def get_queryset(self):
        return SupportTicket.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SupportTicketDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SupportTicketSerializer

    def get_queryset(self):
        return SupportTicket.objects.filter(user=self.request.user)


class TicketReplyCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TicketReplySerializer

    def perform_create(self, serializer):
        ticket = SupportTicket.objects.get(pk=self.kwargs["ticket_id"], user=self.request.user)
        serializer.save(ticket=ticket, user=self.request.user, is_staff_reply=False)


#__________________________________________ ------Verification (SMS/Email)------ _______________________________________
class SendVerificationCodeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        from django.utils import timezone
        from datetime import timedelta
        import random

        profile = request.user.profile
        phone_number = request.data.get('phone_number')
        if not phone_number:
            return Response({'detail': 'شماره موبایل الزامی است'}, status=status.HTTP_400_BAD_REQUEST)
        
        # اعتبارسنجی شماره موبایل ایران
        import re
        if not re.match(r'^09\d{9}$', phone_number):
            return Response({'detail': 'شماره موبایل وارد شده معتبر نیست'}, status=status.HTTP_400_BAD_REQUEST)

        # بررسی اینکه آیا در 2 دقیقه اخیر کد ارسال شده یا نه
        if profile.verification_code_created_at:
            time_since_last_code = timezone.now() - profile.verification_code_created_at
            if time_since_last_code < timedelta(minutes=2):
                return Response({'detail': 'لطفاً 2 دقیقه دیگر تلاش کنید'}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        # تولید کد تایید 6 رقمی
        verification_code = str(random.randint(100000, 999999))
        
        # ذخیره کد تایید و زمان آن
        profile.phone_number = phone_number
        profile.verification_code = verification_code
        profile.verification_code_created_at = timezone.now()
        profile.is_phone_verified = False
        profile.save()

        # TODO: در محیط واقعی، اینجا باید کد را از طریق SMS ارسال کنید
        # برای این مثال، فقط کد را در پاسخ برمی‌گردانیم (در تولید نباید این کار را کنید!)
        print(f"SMS to {phone_number}: Your verification code is {verification_code}")

        return Response({
            'detail': 'کد تایید ارسال شد',
            'verification_code': verification_code  # فقط برای تست! در محیط واقعی این خط را حذف کنید!
        }, status=status.HTTP_200_OK)


class VerifyVerificationCodeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        from django.utils import timezone
        from datetime import timedelta

        profile = request.user.profile
        code = request.data.get('code')

        if not code:
            return Response({'detail': 'کد تایید الزامی است'}, status=status.HTTP_400_BAD_REQUEST)

        # بررسی کد تایید
        if not profile.verification_code or profile.verification_code != code:
            return Response({'detail': 'کد تایید اشتباه است'}, status=status.HTTP_400_BAD_REQUEST)

        # بررسی منقضی شدن کد (معتبر 5 دقیقه)
        if profile.verification_code_created_at:
            time_since_code_sent = timezone.now() - profile.verification_code_created_at
            if time_since_code_sent > timedelta(minutes=5):
                return Response({'detail': 'کد تایید منقضی شده است'}, status=status.HTTP_400_BAD_REQUEST)

        # تایید موبایل
        profile.is_phone_verified = True
        profile.verification_code = None
        profile.verification_code_created_at = None
        profile.save()

        return Response({'detail': 'شماره موبایل با موفقیت تایید شد'}, status=status.HTTP_200_OK)


#__________________________________________ ------Coupon (Apply)------ _______________________________________
class ApplyCouponView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        code = request.data.get('code')
        cart = Cart.objects.get(user=request.user, is_paid=False)

        if not code:
            return Response({'detail': 'کد تخفیف الزامی است'}, status=status.HTTP_400_BAD_REQUEST)

        # پیدا کردن کوپن
        from shop.account.models import Coupon
        try:
            coupon = Coupon.objects.get(code=code)
        except Coupon.DoesNotExist:
            return Response({'detail': 'کد تخفیف نامعتبر است'}, status=status.HTTP_404_NOT_FOUND)

        # بررسی اعتبار کوپن
        if not coupon.is_valid():
            return Response({'detail': 'کد تخفیف معتبر نیست یا منقضی شده است'}, status=status.HTTP_400_BAD_REQUEST)

        # بررسی حداقل مبلغ سفارش
        cart_total = cart.total_price()
        if cart_total < coupon.min_order_amount:
            return Response({'detail': f'حداقل مبلغ سفارش برای استفاده از این کوپن {coupon.min_order_amount} تومان است'}, status=status.HTTP_400_BAD_REQUEST)

        # محاسبه تخفیف
        discount_amount = int(cart_total * (coupon.discount_percent / 100))
        if coupon.max_discount_amount > 0:
            discount_amount = min(discount_amount, coupon.max_discount_amount)

        # ذخیره کوپن در session یا cart (برای این مثال در response برمی‌گردانیم)
        return Response({
            'discount_amount': discount_amount,
            'discount_percent': coupon.discount_percent,
            'total_after_discount': cart_total - discount_amount
        }, status=status.HTTP_200_OK)


#__________________________________________ ------ZarinPal Payment------ _______________________________________
class ZarinPalPaymentRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        import requests
        from django.conf import settings

        # اطلاعات مورد نیاز برای پرداخت
        cart = Cart.objects.get(user=request.user, is_paid=False)
        amount = int(cart.total_price() * 10)  # تبدیل تومان به ریال
        description = f"پرداخت سفارش {cart.id}"
        email = request.user.email or "test@example.com"
        phone = request.user.profile.phone_number or "09123456789"

        # TODO: در محیط واقعی، این اطلاعات را از settings بخوانید
        MERCHANT_ID = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"  # شناسه درگاه زرین‌پال شما
        ZARINPAL_REQUEST_URL = "https://api.zarinpal.com/pg/v4/payment/request.json"
        ZARINPAL_START_PAY_URL = "https://www.zarinpal.com/pg/StartPay/"

        payload = {
            "merchant_id": MERCHANT_ID,
            "amount": amount,
            "callback_url": request.build_absolute_uri('/api/payment/verify/'),
            "description": description,
            "metadata": {
                "email": email,
                "mobile": phone
            }
        }

        try:
            # ارسال درخواست به زرین‌پال
            response = requests.post(ZARINPAL_REQUEST_URL, json=payload, timeout=10)
            result = response.json()

            if result['data']['code'] == 100:
                authority = result['data']['authority']
                
                # TODO: ذخیره authority در دیتابیس برای بعد
                return Response({
                    'payment_url': f"{ZARINPAL_START_PAY_URL}{authority}",
                    'authority': authority
                }, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'خطا در اتصال به درگاه پرداخت'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': f'خطا در درخواست پرداخت: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ZarinPalPaymentVerifyView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        import requests
        from django.conf import settings
        from shop.order.models import Order

        authority = request.GET.get('Authority')
        status = request.GET.get('Status')

        if status != 'OK':
            return Response({'detail': 'پرداخت ناموفق بود'}, status=status.HTTP_400_BAD_REQUEST)

        # TODO: پیدا کردن cart از authority (در این مثال یک cart به صورت hardcode انتخاب می‌کنیم)
        # در محیط واقعی، باید authority را در دیتابیس ذخیره کرده و از آن پیدا کنید
        cart = Cart.objects.filter(is_paid=False).first()
        if not cart:
            return Response({'detail': 'سبد خرید یافت نشد'}, status=status.HTTP_404_NOT_FOUND)

        MERCHANT_ID = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
        amount = int(cart.total_price() * 10)  # تبدیل تومان به ریال
        ZARINPAL_VERIFY_URL = "https://api.zarinpal.com/pg/v4/payment/verify.json"

        payload = {
            "merchant_id": MERCHANT_ID,
            "amount": amount,
            "authority": authority
        }

        try:
            response = requests.post(ZARINPAL_VERIFY_URL, json=payload, timeout=10)
            result = response.json()

            if result['data']['code'] == 100 or result['data']['code'] == 101:
                # پرداخت موفقیت‌آمیز
                cart.is_paid = True
                cart.save()

                # ایجاد سفارش (Order)
                # در این مثال، از signal قبلی استفاده می‌کنیم یا به صورت دستی ایجاد می‌کنیم
                return Response({
                    'detail': 'پرداخت موفقیت‌آمیز بود',
                    'ref_id': result['data']['ref_id'],
                    'cart_id': cart.id
                }, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'خطا در تایید پرداخت'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': f'خطا در تایید پرداخت: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#__________________________________________ ------Checkout------ _______________________________________
class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        from shop.order.models import Order
        from shop.account.models import Coupon

        cart = Cart.objects.get(user=request.user, is_paid=False)
        address_id = request.data.get('address_id')
        shipping_method = request.data.get('shipping_method')
        coupon_code = request.data.get('coupon_code')

        if not address_id or not shipping_method:
            return Response({'detail': 'آدرس و روش ارسال الزامی است'}, status=status.HTTP_400_BAD_REQUEST)

        # پیدا کردن آدرس
        address = ClientAddress.objects.get(pk=address_id, user=request.user)

        # محاسبه هزینه ارسال
        shipping_cost = 0
        if shipping_method == 'post':
            shipping_cost = 20000  # مثال
        elif shipping_method == 'tipax':
            shipping_cost = 30000
        elif shipping_method == 'express':
            shipping_cost = 50000

        # اعمال کوپن
        discount_amount = 0
        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code)
                if coupon.is_valid():
                    cart_total = cart.total_price()
                    if cart_total >= coupon.min_order_amount:
                        discount_amount = int(cart_total * (coupon.discount_percent / 100))
                        if coupon.max_discount_amount > 0:
                            discount_amount = min(discount_amount, coupon.max_discount_amount)
                        # افزایش تعداد استفاده از کوپن
                        coupon.used_count += 1
                        coupon.save()
            except Coupon.DoesNotExist:
                pass

        # محاسبه مبلغ نهایی
        total_price = cart.total_price() + shipping_cost - discount_amount

        # ایجاد سفارش
        order = Order.objects.create(
            user=request.user,
            cart=cart,
            address=address,
            order_number=str(order.id),
            payment_method='online',
            payment_status='در انتظار پرداخت',
            status='در حال انتظار',
            shipping_method=shipping_method,
            shipping_cost=shipping_cost,
            total_price=total_price,
            discount_code=coupon_code,
            discount_amount=discount_amount
        )

        # TODO: در این مرحله باید کاربر را به درگاه پرداخت هدایت کنید
        return Response({
            'order_id': order.id,
            'order_number': order.order_number,
            'total_price': total_price,
            'shipping_cost': shipping_cost,
            'discount_amount': discount_amount
        }, status=status.HTTP_201_CREATED)
