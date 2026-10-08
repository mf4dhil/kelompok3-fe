import api from './api';

const handleError = (error) => {
  const message = error.response?.data?.message || error.message || 'Terjadi kesalahan';
  throw new Error(message);
};

// Material Master (CRUD)
export const materialService = {
  getAll: async (params = {}) => {
    try {
      const { data } = await api.get('/materials', { params });
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const { data } = await api.get(`/materials/${id}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  create: async (payload) => {
    try {
      const { data } = await api.post('/materials', payload);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  update: async (id, payload) => {
    try {
      const { data } = await api.patch(`/materials/${id}`, payload);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const { data } = await api.delete(`/materials/${id}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  // Stock & Transactions
  getStock: async (id) => {
    try {
      const { data } = await api.get(`/materials/${id}/stock`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  getTransactions: async (id, params = {}) => {
    try {
      const { data } = await api.get(`/materials/${id}/transactions`, { params });
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  getLowStock: async (params = {}) => {
    try {
      const { data } = await api.get('/materials/low-stock', { params });
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  // Usage & Adjustment
  recordUsage: async (id, payload) => {
    try {
      const { data } = await api.post(`/materials/${id}/usage`, payload);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  recordAdjustment: async (id, payload) => {
    try {
      const { data } = await api.post(`/materials/${id}/adjustment`, payload);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },
};

// Material Purchases
export const purchaseService = {
  getAll: async (params = {}) => {
    try {
      const { data } = await api.get('/material-purchases', { params });
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const { data } = await api.get(`/material-purchases/${id}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  create: async (payload) => {
    try {
      const { data } = await api.post('/material-purchases', payload);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },
};
