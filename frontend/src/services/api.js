import api from '../api/axios';

// Products API
export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProduct = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return response.data;
};

export const createProduct = async (formData) => {
  const response = await api.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateProduct = async (productId, formData) => {
  const response = await api.post(`/products/${productId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params: {
      _method: 'PUT' // Laravel method spoofing for multipart/form-data
    }
  });
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
};

export const getMyProducts = async (params = {}) => {
  const response = await api.get('/my-products', { params });
  return response.data;
};

export const likeProduct = async (productId) => {
  const response = await api.post(`/products/${productId}/like`);
  return response.data;
};

// Categories API
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

// Locations API
export const getLocations = async () => {
  const response = await api.get('/locations');
  return response.data;
};

// Auth API
export const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const signup = async (userData) => {
  const response = await api.post('/signup', userData);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/logout');
  return response.data;
};

export const startChat = async (productId) => {
  const { data } = await api.post("/chats/start", { product_id: productId });
  return data;
};
export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

// Favorites/Wishlist API
export const getFavorites = async () => {
  const response = await api.get('/favorites');
  return response.data;
};

export const getFavoriteIds = async () => {
  const response = await api.get('/favorites/ids');
  return response.data;
};

export const addToFavorites = async (productId) => {
  const response = await api.post(`/favorites/${productId}`);
  return response.data;
};

export const removeFromFavorites = async (productId) => {
  const response = await api.delete(`/favorites/${productId}`);
  return response.data;
};

export const checkFavorite = async (productId) => {
  const response = await api.get(`/favorites/${productId}/check`);
  return response.data;
};
