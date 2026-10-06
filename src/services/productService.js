import api from "./api";

// Get all products (admin)
export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

// Get product by ID
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Create product (admin) - now accepts full product + variants payload
export const createProduct = async (productData) => {
  try {
    // Backend expects: name, description, type_id, is_active, variants[]
    // variants: [{ shape_id, size_id, flavor_id, price, is_active }]
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Gagal membuat produk:', error);
    throw error;
  }
};

// Update product (admin)
export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error('Gagal memperbarui produk:', error);
    throw error;
  }
};

// Add variants to an existing product (admin) - only adds NEW variants
export const addProductVariants = async (id, variants) => {
  try {
    const response = await api.put(`/products/${id}/variants`, { variants });
    return response.data;
  } catch (error) {
    console.error('Gagal menambahkan varian:', error);
    throw error;
  }
};

// Update product status (admin)
export const updateProductStatus = async (id, status) => {
  try {
    const response = await api.patch(`/products/${id}/status`, {
      status: status === 'aktif' ? true : (status === 'tidak_aktif' ? false : status)
    });
    return response.data;
  } catch (error) {
    console.error('Gagal memperbarui status produk:', error);
    throw error;
  }
};

// Delete product (admin)
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
