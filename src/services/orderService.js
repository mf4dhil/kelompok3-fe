import api from "./api";

const handleError = (error) => {
  const message = error.response?.data?.msg || error.message || 'Terjadi kesalahan';
  throw new Error(message);
};

export const ordersService = {
  getAll: async (params = {}) => {
    try {
      const { data } = await api.get('/orders', { params });
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  create: async (payload) => {
    try {
      const { data } = await api.post('/orders', payload);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  update: async (id, payload) => {
    try {
      const { data } = await api.patch(`/orders/${id}`, payload);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  updateStatus: async (id, status) => {
    try {
      const { data } = await api.patch(`/orders/${id}/status`, { status });
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  updatePayment: async (id, payload) => {
    try {
      const { data } = await api.patch(`/orders/${id}/payment`, payload);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const { data } = await api.delete(`/orders/${id}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },
};

// Customer Service
export const customersService = {
  getAll: async (params = {}) => {
    try {
      const { data } = await api.get('/customers', { params });
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const { data } = await api.get(`/customers/${id}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  create: async (payload) => {
    try {
      const { data } = await api.post('/customers', payload);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  update: async (id, payload) => {
    try {
      const { data } = await api.patch(`/customers/${id}`, payload);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const { data } = await api.delete(`/customers/${id}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },
};
