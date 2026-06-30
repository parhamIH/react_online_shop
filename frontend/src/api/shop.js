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

  async logout() {
    return apiRequest('/auth/logout/', {
      method: 'POST',
      auth: true,
    });
  },

  async getProfile() {
    return apiRequest('/auth/profile/', { auth: true });
  },

  async updateProfile(data) {
    return apiRequest('/auth/profile/', {
      method: 'PATCH',
      auth: true,
      body: data,
    });
  },

  async getAddresses() {
    return unwrapPaginated(await apiRequest('/addresses/', { auth: true }));
  },

  async createAddress(data) {
    return apiRequest('/addresses/', {
      method: 'POST',
      auth: true,
      body: data,
    });
  },

  async updateAddress(id, data) {
    return apiRequest(`/addresses/${id}/`, {
      method: 'PATCH',
      auth: true,
      body: data,
    });
  },

  async deleteAddress(id) {
    return apiRequest(`/addresses/${id}/`, {
      method: 'DELETE',
      auth: true,
    });
  },

  async getOrders() {
    return unwrapPaginated(await apiRequest('/orders/', { auth: true }));
  },

  async getOrder(id) {
    return apiRequest(`/orders/${id}/`, { auth: true });
  },

  async getComments() {
    return unwrapPaginated(await apiRequest('/comments/', { auth: true }));
  },

  async getNotifications() {
    return unwrapPaginated(await apiRequest('/notifications/', { auth: true }));
  },

  async getFavorites() {
    return apiRequest('/favorites/', { auth: true });
  },

  async getCoupons() {
    return unwrapPaginated(await apiRequest('/coupons/', { auth: true }));
  },

  async getSupportTickets() {
    return unwrapPaginated(await apiRequest('/support-tickets/', { auth: true }));
  },

  async createSupportTicket(data) {
    return apiRequest('/support-tickets/', {
      method: 'POST',
      auth: true,
      body: data,
    });
  },

  async getSupportTicket(id) {
    return apiRequest(`/support-tickets/${id}/`, { auth: true });
  },

  async createTicketReply(ticketId, data) {
    return apiRequest(`/support-tickets/${ticketId}/replies/`, {
      method: 'POST',
      auth: true,
      body: data,
    });
  },

  async getCart() {
    return apiRequest('/cart/', { auth: true });
  },
};
