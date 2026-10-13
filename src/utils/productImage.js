import { API_URL } from '../services/api';

export const getProductImageUrl = (image) => {
  if (!image) return '';
  if (/^(https?:|data:|blob:)/i.test(image)) return image;
  return `${API_URL}/${image.replace(/^\/+/, '')}`;
};
