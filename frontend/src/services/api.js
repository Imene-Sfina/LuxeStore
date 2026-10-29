import axios from 'axios';
 
const BASE = 'http://localhost:8089/api';
 
const api = axios.create({ baseURL: BASE });
 
// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
 
// Auth
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
};
 
// Products
export const productService = {
  getAll: () => api.get('/products'),
 
  // ADD — envoie le fichier image depuis le PC via FormData
  add: ({ name, price, description, imageFile }) => {
    const fd = new FormData();
    fd.append('name', name);
    fd.append('price', price);
    fd.append('description', description || '');
    fd.append('image', imageFile);          // fichier réel, pas une URL
    return api.post('/products', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
 
  // UPDATE — pas d'image (le backend accepte un JSON body pour PUT)
  update: (id, { name, price, description, image }) =>
    api.put(`/products/${id}`, { name, price: parseFloat(price), description, image }),
 
  delete: (id) => api.delete(`/products/${id}`),
};
 
// Orders
export const orderService = {
  place: (order) => api.post('/orders', order),
};
 
export default api;