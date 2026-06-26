from django.urls import path

from . import views

urlpatterns = [
    path("home/", views.HomeAPIView.as_view(), name="api-home"),
    path("categories/", views.CategoryListView.as_view(), name="api-categories"),
    path("base-categories/", views.BaseCategoryListView.as_view(), name="api-base-categories"),
    path("brands/", views.BrandListView.as_view(), name="api-brands"),
    path("brands/<int:pk>/", views.BrandDetailView.as_view(), name="api-brand-detail"),
    path("products/", views.ProductListView.as_view(), name="api-products"),
    path("products/offers/", views.ProductOffersView.as_view(), name="api-product-offers"),
    path("products/new/", views.ProductNewArrivalsView.as_view(), name="api-product-new"),
    path("products/<int:pk>/", views.ProductDetailView.as_view(), name="api-product-detail"),
    path("products/<int:pk>/related/", views.ProductRelatedView.as_view(), name="api-product-related"),
    path("articles/", views.ArticleListView.as_view(), name="api-articles"),
    path("articles/<int:pk>/", views.ArticleDetailView.as_view(), name="api-article-detail"),
    path("auth/register/", views.RegisterAPIView.as_view(), name="api-register"),
    path("auth/login/", views.LoginAPIView.as_view(), name="api-login"),
    path("auth/logout/", views.LogoutAPIView.as_view(), name="api-logout"),
    path("auth/profile/", views.ProfileAPIView.as_view(), name="api-profile"),
    path("addresses/", views.AddressListCreateView.as_view(), name="api-addresses"),
    path("addresses/<int:pk>/", views.AddressDetailView.as_view(), name="api-address-detail"),
    path("cart/", views.CartDetailView.as_view(), name="api-cart"),
    path("cart/items/", views.CartAddItemView.as_view(), name="api-cart-add"),
    path("cart/items/<int:item_id>/", views.CartUpdateItemView.as_view(), name="api-cart-update"),
    path("cart/items/<int:item_id>/remove/", views.CartRemoveItemView.as_view(), name="api-cart-remove"),
]
