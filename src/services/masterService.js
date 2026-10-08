// import api from "./api";

// // Get all shapes
// export const getShapes = async () => {
//   const response = await api.get('/shapes');
//   return response.data;
// };

// // Get all sizes
// export const getSizes = async () => {
//   const response = await api.get('/size');
//   return response.data;
// };

// // Get all flavors
// export const getFlavors = async () => {
//   const response = await api.get('/flavors');
//   return response.data;
// };

// // Get all types (with category)
// export const getTypes = async () => {
//   const response = await api.get('/types');
//   return response.data;
// };

// // Get all categories
// export const getCategories = async () => {
//   const response = await api.get('/categories');
//   return response.data;
// };


import api from "./api";

// Get all shapes
export const getShapes = async () => {
  const response = await api.get('/shapes');
  return response.data;
};

// Get all sizes
export const getSizes = async () => {
  const response = await api.get('/size');
  return response.data;
};

// Get all flavors
export const getFlavors = async () => {
  const response = await api.get('/flavors');
  return response.data;
};

// Get all types
export const getTypes = async () => {
  const response = await api.get('/types');
  return response.data;
};

// Get all categories
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};