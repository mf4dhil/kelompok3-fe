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

// Ubah data dari backend ke bentuk yang dipakai ProductCard.
// Kalau struktur respons backend berbeda, cukup sesuaikan fungsi ini.
const mapCustomerProduct = (item) => {
  const variants = item.ProductVariants || item.ProductVariant || item.variants || [];
  const prices = variants.map((v) => Number(v.price)).filter((n) => !Number.isNaN(n));

  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    image: item.image,
    price: item.price ?? (prices.length ? Math.min(...prices) : 0),
    category: item.Type?.name || '',
    is_active: item.is_active,
  };
};

export const getCustomerProductList = async () => {
  const res = await getCustomerProducts();
  console.log('customer products:', res); // hapus kalau data sudah sesuai
  const list = Array.isArray(res) ? res : res.data || [];
  return list.map(mapCustomerProduct).filter((p) => p.is_active !== false);
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