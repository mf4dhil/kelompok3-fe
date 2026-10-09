import api from '../services/api';

export const logout = async () => {
  try {
    // Panggil backend untuk clear cookie
    await api.post('/logout');
  } catch (error) {
    console.error('Logout API error:', error);
  }
  
  // Hapus token dari localStorage
  localStorage.removeItem('token');
  
  // Redirect ke login
  window.location.href = '/login';
};