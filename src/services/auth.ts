import axios from 'axios';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Interceptor để tự động thêm token vào header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await API.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await API.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await API.get<User>('/users/me');
    return response.data;
  },

  updateProfile: async (data: { name?: string; avatar?: string }): Promise<User> => {
    const response = await API.put<{ user: User }>('/users/me', data);
    return response.data.user;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await API.put('/users/change-password', data);
  },

  googleLogin: () => {
    window.location.href = 'http://localhost:5000/auth/google';
  }
};