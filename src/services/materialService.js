import api from "./api";
import { createCrudService, withServiceErrorHandling } from "./serviceUtils";

const materials = createCrudService("/materials", { messageKey: "message" });
const request = (promise) => withServiceErrorHandling(promise, "message");

export const materialService = {
  ...materials,
  getStock: (id) => request(api.get(`/materials/${id}/stock`)),
  getTransactions: (id, params = {}) =>
    request(api.get(`/materials/${id}/transactions`, { params })),
  getLowStock: (params = {}) => request(api.get("/materials/low-stock", { params })),
  recordUsage: (id, payload) => request(api.post(`/materials/${id}/usage`, payload)),
  recordAdjustment: (id, payload) =>
    request(api.post(`/materials/${id}/adjustment`, payload)),
  getUnits: (id) => request(api.get(`/materials/${id}/units`)),
  createUnit: (id, payload) => request(api.post(`/materials/${id}/units`, payload)),
  updateUnit: (id, unitId, payload) =>
    request(api.patch(`/materials/${id}/units/${unitId}`, payload)),
  deleteUnit: (id, unitId) => request(api.delete(`/materials/${id}/units/${unitId}`)),
};

export const purchaseService = {
  getAll: (params = {}) => request(api.get("/material-purchases", { params })),
  getById: (id) => request(api.get(`/material-purchases/${id}`)),
  create: (payload) => request(api.post("/material-purchases", payload)),
};
