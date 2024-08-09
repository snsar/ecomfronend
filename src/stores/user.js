import { defineStore } from 'pinia';
import api from '../services/api';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoggedIn: false,
    token: localStorage.getItem('token') || null, // Initialize token from localStorage
  }),
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    setLoggedIn(status) {
      this.isLoggedIn = status;
    },
    async login(email, password) {
      try {
        const response = await api.login(email, password);
        const { access_token } = response.data.data;

        this.setToken(access_token);
        this.setLoggedIn(true);

        // Optionally fetch user data here if needed
        // await this.fetchUserInfo();
      } catch (error) {
        console.error('Login failed', error);
        throw error;
      }
    },
    async register(userData) {
      try {
        const response = await api.register(userData);
        const { access_token } = response.data;

        this.setToken(access_token);
        this.setLoggedIn(true);
        
        // Optionally fetch user data here if needed
        // await this.fetchUserInfo();
      } catch (error) {
        console.error('Registration failed', error);
        throw error;
      }
    },
    async fetchUserInfo() {
      try {
        const response = await api.getUserInfo();
        this.user = response.data;
      } catch (error) {
        console.error('Failed to fetch user info', error);
      }
    },
    resetState() {
      this.user = null;
      this.isLoggedIn = false;
      this.token = null;
      localStorage.removeItem('token');
    },
    async logout() {
      try {
        await api.logout();
      } catch (error) {
        console.error('Logout failed', error);
      } finally {
        this.resetState();
      }
    },
  },
});
