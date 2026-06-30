import { shopApi } from '../api/shop';
import { DataService as mockData } from '../data/data';

const useApi = import.meta.env.VITE_USE_API === 'true';

function mapHomeData(home = {}) {
  const safeHome = home || {};
  
  const banners = (Array.isArray(safeHome.banners) ? safeHome.banners : []).filter(Boolean).map((b) => ({
    id: b?.id || Math.random(),
    title: b?.title || '',
    subtitle: b?.subtitle || '',
    image: b?.image || '',
    btn: 'Shop Now',
    link: b?.link || '/products',
  }));

  const brands = (Array.isArray(safeHome.featuredBrands) ? safeHome.featuredBrands : [])
    .filter(Boolean)
    .map((fb) => fb?.brand)
    .filter(Boolean);

  return {
    banners,
    brands,
    promotionalBanners: Array.isArray(safeHome.promotionalBanners) ? safeHome.promotionalBanners : []
  };
}

function mapCategories(categories = []) {
  return (Array.isArray(categories) ? categories : []).map((c) => ({
    id: c?.id,
    name: c?.en_name || c?.name,
    icon: 'tag',
    image: c?.image,
    productCount: c?.productCount,
    color: 'bg-blue-50 text-blue-600',
  }));
}

const apiService = {
  getVideos: () => Promise.resolve(Array.isArray(mockData.videos) ? mockData.videos : []),

  getHome: async () => {
    try {
      const res = await shopApi.getHome();
      return mapHomeData(res || {});
    } catch (err) {
      return mapHomeData({});
    }
  },

  getCategories: async () => {
    try {
      return mapCategories(await shopApi.getCategories());
    } catch (err) {
      return mapCategories([]);
    }
  },

  getBrands: async () => {
    try {
      const res = await shopApi.getBrands();
      return Array.isArray(res) ? res : [];
    } catch (err) {
      return [];
    }
  },

  getBrand: (id) => shopApi.getBrand(id).catch(() => null),

  getProducts: (params = {}) => shopApi.getProducts(params).then(res => Array.isArray(res) ? res : []).catch(() => []),

  getProduct: (id) => shopApi.getProduct(id).catch(() => null),

  getOffers: () => shopApi.getOffers().then(res => Array.isArray(res) ? res : []).catch(() => []),

  getNewArrivals: () => shopApi.getNewArrivals().then(res => Array.isArray(res) ? res : []).catch(() => []),

  getRelatedProducts: (productId) => shopApi.getRelatedProducts(productId).then(res => Array.isArray(res) ? res : []).catch(() => []),

  getArticles: () => shopApi.getArticles().then(res => Array.isArray(res) ? res : []).catch(() => []),

  getArticle: (id) => shopApi.getArticle(id).catch(() => null),

  searchProducts: (query) => shopApi.searchProducts(query).then(res => Array.isArray(res) ? res : []).catch(() => []),

  getProductsByCategory: (cat) => shopApi.getProducts({ category: cat }).then(res => Array.isArray(res) ? res : []).catch(() => []),

  getProductsByBrand: (brandId) => shopApi.getProducts({ brand: brandId }).then(res => Array.isArray(res) ? res : []).catch(() => []),
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
