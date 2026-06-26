from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Prefetch, Q
from rest_framework import generics, permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from shop.account.models import ClientAddress, Profile
from shop.articles.models import Article
from shop.cart.models import Cart, CartItem
from shop.categories.models import BaseCategories, Category
from shop.home.models import FeaturedBrand, HomeSlider, PromotionalBanner
from shop.products.models import Product, ProductPackage
from shop.public.models import Brand

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

        cart = self.get_or_create_cart(request.user)
        item, created = CartItem.objects.get_or_create(cart=cart, package=package, defaults={"count": count})
        if not created:
            item.count += count
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
