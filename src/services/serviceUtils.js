import api from "./api";

export const getResponseData = async (request) => {
  const { data } = await request;
  return data;
};

export const throwServiceError = (error, messageKey = "msg") => {
  const message =
    error.response?.data?.[messageKey] || error.message || "Terjadi kesalahan";
  throw new Error(message);
};

export const withServiceErrorHandling = (request, messageKey = "msg") =>
  getResponseData(request).catch((error) => throwServiceError(error, messageKey));

export const createCrudService = (endpoint, { messageKey = "msg" } = {}) => {
  const request = (promise) => withServiceErrorHandling(promise, messageKey);

  return {
    getAll: (params = {}) => request(api.get(endpoint, { params })),
    getById: (id) => request(api.get(`${endpoint}/${id}`)),
    create: (payload) => request(api.post(endpoint, payload)),
    update: (id, payload) => request(api.patch(`${endpoint}/${id}`, payload)),
    delete: (id) => request(api.delete(`${endpoint}/${id}`)),
  };
};
