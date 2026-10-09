import api from "./api";

const handleError = (error) => {
  const message = error.response?.data?.msg || error.message || 'Terjadi kesalahan';
  throw new Error(message);
};

export const getProducts = async (params = {}) => {
  try {
    const { data } = await api.get('/products', { params });
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const getProductById = async (id) => {
  try {
    const { data } = await api.get(`/products/${id}`);
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const createProduct = async (payload) => {
  try {
    const { data } = await api.post('/products', payload);
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateProduct = async (id, payload) => {
  try {
    const { data } = await api.patch(`/products/${id}`, payload);
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteProduct = async (id) => {
  try {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateProductStatus = async (id, payload) => {
  try {
    const { data } = await api.patch(`/products/${id}/status`, payload);
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const addProductVariants = async (id, variants) => {
  try {
    const { data } = await api.put(`/products/${id}/variants`, { variants });
    return data;
  } catch (error) {
    return handleError(error);
  }
};
