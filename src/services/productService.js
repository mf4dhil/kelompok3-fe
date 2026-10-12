import api from "./api";
import { createCrudService, withServiceErrorHandling } from "./serviceUtils";

const products = createCrudService("/products", { messageKey: "message" });

export const getProducts = products.getAll;
export const getProductById = products.getById;
export const createProduct = products.create;
export const updateProduct = products.update;
export const deleteProduct = products.delete;

export const updateProductStatus = (id, payload) =>
  withServiceErrorHandling(api.patch(`/products/${id}/status`, payload), "message");

export const addProductVariants = (id, variants) =>
  withServiceErrorHandling(api.put(`/products/${id}/variants`, { variants }), "message");


export const getCustomerProducts = async () => {
  const response = await api.get("/products/customer");
  return response.data;
};


// import api from "./api";
// import {
//   createCrudService,
//   withServiceErrorHandling,
// } from "./serviceUtils";

// const products = createCrudService("/products", {
//   messageKey: "message",
// });

// export const getProducts = products.getAll;
// export const getProductById = products.getById;
// export const createProduct = products.create;
// export const updateProduct = products.update;
// export const deleteProduct = products.delete;

// export const updateProductStatus = (id, payload) =>
//   withServiceErrorHandling(
//     api.patch(`/products/${id}/status`, payload),
//     "message"
//   );

// export const addProductVariants = (id, variants) =>
//   withServiceErrorHandling(
//     api.put(`/products/${id}/variants`, { variants }),
//     "message"
//   );

// // Mengambil produk untuk homepage customer
// export const getCustomerProducts = async () => {
//   const response = await api.get("/products/customer");
//   return response.data;
// };