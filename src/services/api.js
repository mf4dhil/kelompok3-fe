import axios from 'axios';

export const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

// Interceptor untuk handling error 401
// Kami tidak melakukan redirect otomatis sini karena ProtectedRoute
// akan menangani alur autentikasi setelah cek getMe()
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jangan redirect ke sini; ProtectedRoute yang mengurus alur auth
    return Promise.reject(error);
  },
);

export default api;
