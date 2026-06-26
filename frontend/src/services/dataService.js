import { shopApi } from '../api/shop';
import { DataService as mockData } from '../data/data';

const useApi = import.meta.env.VITE_USE_API === 'true';

function mapHomeData(home) {
  const banners = (home.banners || []).map((b) => ({
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    image: b.image,
    btn: 'Shop Now',
    link: b.link || '/products',
  }));

  const brands = (home.featuredBrands || []).map((fb) => fb.brand).filter(Boolean);

  return { banners, brands, promotionalBanners: home.promotionalBanners || [] };
}

function mapCategories(categories) {
  return categories.map((c) => ({
    id: c.id,
    name: c.en_name || c.name,
    icon: 'tag',
    image: c.image,
    productCount: c.productCount,
    color: 'bg-blue-50 text-blue-600',
  }));
}

const apiService = {
  getVideos: () => Promise.resolve(mockData.videos),

  getHome: async () => mapHomeData(await shopApi.getHome()),

  getCategories: async () => mapCategories(await shopApi.getCategories()),

  getBrands: () => shopApi.getBrands(),

  getBrand: (id) => shopApi.getBrand(id),

  getProducts: (params = {}) => shopApi.getProducts(params),

  getProduct: (id) => shopApi.getProduct(id),

  getOffers: () => shopApi.getOffers(),

  getNewArrivals: () => shopApi.getNewArrivals(),

  getRelatedProducts: (productId) => shopApi.getRelatedProducts(productId),

  getArticles: () => shopApi.getArticles(),

  getArticle: (id) => shopApi.getArticle(id),

  searchProducts: (query) => shopApi.searchProducts(query),

  getProductsByCategory: (cat) => shopApi.getProducts({ category: cat }),

  getProductsByBrand: (brandId) => shopApi.getProducts({ brand: brandId }),
};

const mockService = {
  getVideos: () => Promise.resolve(mockData.videos),

  getHome: () =>
    Promise.resolve({
      banners: mockData.banners,
      brands: mockData.brands,
      promotionalBanners: [],
    }),

  getCategories: () => Promise.resolve(mockData.categories),

  getBrands: () => Promise.resolve(mockData.brands),

  getBrand: (id) => Promise.resolve(mockData.getBrand(id)),

  getProducts: () => Promise.resolve([...mockData.products]),

  getProduct: (id) => Promise.resolve(mockData.getProduct(id)),

  getOffers: () => Promise.resolve(mockData.getOffers()),

  getNewArrivals: () => Promise.resolve(mockData.getNewArrivals()),

  getRelatedProducts: (productId) => Promise.resolve(mockData.getRelatedProducts(productId)),

  getArticles: () => Promise.resolve(mockData.articles),

  getArticle: (id) => Promise.resolve(mockData.getArticle(id)),

  searchProducts: (query) => Promise.resolve(mockData.searchProducts(query)),

  getProductsByCategory: (cat) => Promise.resolve(mockData.getProductsByCategory(cat)),

  getProductsByBrand: (brandId) => Promise.resolve(mockData.getProductsByBrand(brandId)),
};

export const DataService = useApi ? apiService : mockService;
export const isApiMode = useApi;
