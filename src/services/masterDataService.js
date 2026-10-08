import api from "./api";

const handleError = (error) => {
  const message = error.response?.data?.msg || error.message || 'Terjadi kesalahan';
  throw new Error(message);
};

const buildService = (endpoint) => ({
  getAll: async () => {
    try {
      const { data } = await api.get(endpoint);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },
  create: async (payload) => {
    try {
      const { data } = await api.post(endpoint, payload);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },
  update: async (id, payload) => {
    try {
      const { data } = await api.patch(`${endpoint}/${id}`, payload);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },
  delete: async (id) => {
    try {
      const { data } = await api.delete(`${endpoint}/${id}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },
});

export const shapesService = buildService('/shapes');
export const sizesService = buildService('/size');
export const flavorsService = buildService('/flavors');
export const typesService = buildService('/types');
export const categoriesService = buildService('/categories');
export const rekeningsService = {
  getAll: async (params = {}) => {
    try {
      const { data } = await api.get('/rekenings', { params });
      return data;
    } catch (error) {
      return handleError(error);
    }
  },
  create: async (payload) => {
    try {
      const { data } = await api.post('/rekenings', payload);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },
  update: async (id, payload) => {
    try {
      const { data } = await api.patch(`/rekenings/${id}`, payload);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },
  delete: async (id) => {
    try {
      const { data } = await api.delete(`/rekenings/${id}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },
};
