import axios from 'axios';

const API_URL = 'http://your-backend-url.com';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is important for cookies
  timeout: 10000,
});

export const authApi = {
  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  signup: async (name, email, password) => {
    try {
      const response = await api.post('/signup', { name, email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  checkAuth: async () => {
    try {
      const response = await api.get('/checkAuth');
      return response.data;
    } catch (error) {
      return null; // User is not authenticated
    }
  }
};