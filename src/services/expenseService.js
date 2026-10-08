import api from './api';

const handleError = (error) => {
  const message = error.response?.data?.message || error.message || 'Terjadi kesalahan';
  throw new Error(message);
};

// Expense Categories
export const expenseCategoryService = {
  getAll: async (params = {}) => {
    try {
      const { data } = await api.get('/expense-categories', { params });
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const { data } = await api.get(`/expense-categories/${id}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  create: async (payload) => {
    try {
      const { data } = await api.post('/expense-categories', payload);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  update: async (id, payload) => {
    try {
      const { data } = await api.patch(`/expense-categories/${id}`, payload);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const { data } = await api.delete(`/expense-categories/${id}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },
};

// Expenses
export const expenseService = {
  getAll: async (params = {}) => {
    try {
      const { data } = await api.get('/expenses', { params });
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const { data } = await api.get(`/expenses/${id}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  create: async (payload) => {
    try {
      const { data } = await api.post('/expenses', payload);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  update: async (id, payload) => {
    try {
      const { data } = await api.patch(`/expenses/${id}`, payload);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const { data } = await api.delete(`/expenses/${id}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },
};
