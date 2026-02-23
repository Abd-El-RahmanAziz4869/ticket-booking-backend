import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  profile: () => api.get('/auth/profile'),
  logout: () => {
    localStorage.removeItem('token');
  },
};

// Events endpoints
export const eventsAPI = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  getEvents: (query) => api.get('/events', { params: query }),
};

// Bookings endpoints
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getByUser: () => api.get('/bookings/user/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  getAll: (params) => api.get('/bookings', { params }),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
};

// Payments endpoints
export const paymentsAPI = {
  initiate: (data) => api.post('/payments/initiate', data),
  confirm: (data) => api.post('/payments/confirm', data),
  webhook: (data) => api.post('/payments/webhook', data),
};

// Seats endpoints
export const seatsAPI = {
  getAvailable: (eventId) => api.get(`/events/${eventId}/available-seats`),
  getAll: (eventId) => api.get(`/events/${eventId}/seats`),
};

// Admin endpoints
export const adminAPI = {
  getEvents: (params) => api.get('/admin/events', { params }),
  createEvent: (data) => api.post('/admin/events', data),
  updateEvent: (id, data) => api.put(`/admin/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/admin/events/${id}`),
  getBookings: (params) => api.get('/admin/bookings', { params }),
  getRevenue: (params) => api.get('/admin/revenue', { params }),
  getStats: () => api.get('/admin/stats'),
};

export default api;
