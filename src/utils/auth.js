export const logout = () => {
  localStorage.removeItem('admin');
  window.location.href = '/login';
};