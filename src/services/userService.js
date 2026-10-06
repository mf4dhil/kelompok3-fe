// import api from "./api";

// export const getUsers = () => api.get("/users");
// export const createUser = (data) => api.post("/users", data);
// export const updateUser = (id, data) => api.put(`/users/${id}`, data);
// export const deleteUser = (id) => api.delete(`/users/${id}`);

// import api from "./api";

// // Prefix "/auth" adalah dugaan, cek di app.js (app.use("/api/auth", ...))
// export const getUsers = () => api.get("/auth/users");
// export const createUser = (data) => api.post("/auth/register", data); // sementara, belum ada route admin
// export const updateUser = (id, data) => api.put(`/auth/user/edit/${id}`, data);
// export const deleteUser = (id) => api.delete(`/auth/user/${id}`); // belum ada di backend


import api from "./api";

// Prefix route backend. Cek di app.js: app.use("/api/auth", router)
// Kalau ternyata prefix-nya beda, cukup ubah satu baris ini.
// const BASE = "/api";

// GET    /users             -> semua user (admin)
export const getUsers = () => api.get(`/users`);

// POST   /register          -> sementara dipakai untuk tambah user
export const createUser = (data) => api.post(`/register`, data);

// PUT    /user/edit/:id     -> edit name, email, phone, address (admin)
export const updateUser = (id, data) => api.put(`/user/edit/${id}`, data);

// DELETE /user/:id          -> BELUM ADA di backend, minta temanmu menambahkannya
export const deleteUser = (id) => api.delete(`/user/${id}`);