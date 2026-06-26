import { apiRequest, unwrapPaginated } from './client';

export const shopApi = {
  async getHome() {
    return apiRequest('/home/');
  },

  async getCategories() {
    return unwrapPaginated(await apiRequest('/categories/'));
  },

  async getBrands() {
    return unwrapPaginated(await apiRequest('/brands/'));
  },

  async getBrand(id) {
    return apiRequest(`/brands/${id}/`);
  },

  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return unwrapPaginated(await apiRequest(`/products/${query ? `?${query}` : ''}`));
  },

  async getProduct(id) {
    return apiRequest(`/products/${id}/`);
  },

  async getOffers() {
    return unwrapPaginated(await apiRequest('/products/offers/'));
  },

  async getNewArrivals() {
    return unwrapPaginated(await apiRequest('/products/new/'));
  },

  async getRelatedProducts(id) {
    return unwrapPaginated(await apiRequest(`/products/${id}/related/`));
  },

  async getArticles() {
    return unwrapPaginated(await apiRequest('/articles/'));
  },

  async getArticle(id) {
    return apiRequest(`/articles/${id}/`);
  },

  async searchProducts(query) {
    return this.getProducts({ search: query });
  },

  async login(username, password) {
    return apiRequest('/auth/login/', {
      method: 'POST',
      body: { username, password },
    });
  },

  async register(payload) {
    return apiRequest('/auth/register/', {
      method: 'POST',
      body: payload,
    });
  },

  async getCart() {
    return apiRequest('/cart/', { auth: true });
  },
};
