import api from "./api";
import { createCrudService, withServiceErrorHandling } from "./serviceUtils";

const orders = createCrudService("/orders");

export const ordersService = {
  ...orders,
  updateStatus: (id, status) =>
    withServiceErrorHandling(api.patch(`/orders/${id}/status`, { status })),
  updatePayment: (id, payload) =>
    withServiceErrorHandling(api.patch(`/orders/${id}/payment`, payload)),
};

export const customersService = createCrudService("/customers");
