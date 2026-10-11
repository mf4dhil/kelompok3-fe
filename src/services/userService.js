import api from "./api";

export const getUsers = () => api.get("/users");
export const createUser = (data) => api.post("/register", data);
export const updateUser = (id, data) => api.put(`/user/edit/${id}`, data);
export const deleteUser = (id) => api.delete(`/user/${id}`);
