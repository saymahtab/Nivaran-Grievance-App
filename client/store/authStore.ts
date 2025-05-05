import { create } from 'zustand';
import { authApi } from '../api/authApi';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const userData = await authApi.login(email, password);
      set({ user: userData, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message || 'Login failed', isLoading: false });
      return false;
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const userData = await authApi.signup(name, email, password);
      set({ user: userData, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message || 'Signup failed', isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authApi.logout();
      set({ user: null, isAuthenticated: false, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message || 'Logout failed', isLoading: false });
      return false;
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const userData = await authApi.checkAuth();
      set({ 
        user: userData, 
        isAuthenticated: !!userData, 
        isLoading: false 
      });
      return !!userData;
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;