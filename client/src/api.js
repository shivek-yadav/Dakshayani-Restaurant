import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api/v1', withCredentials: true, timeout: 16000 });
api.interceptors.response.use(r => r, err => Promise.reject(new Error(err.response?.data?.message || err.message || 'Something went wrong')));
export const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
export const prettyDate = (s) => s ? new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
export const photoFallback = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80';
export const initialSettings = { restaurantName: 'Dakshayani', tagline: 'The Art of Indian Dining', phone: '+91 98765 43210', email: 'hello@dakshayani.example', address: 'Your restaurant address, India', openingHours: [], bookingEnabled: true, orderingEnabled: true, deliveryEnabled: false, reservationMaxGuests: 12 };
