import axios from 'axios';
import { AUTH_URL, API_URL } from '../config/api';

export const register = async (email: string, password: string, name: string) => {
  // ✅ Используем AUTH_URL (без /api)
  const response = await axios.post(`${AUTH_URL}/auth/register`, { email, password, name });
  return response.data;
};

export const login = async (email: string, password: string) => {
  // ✅ Используем AUTH_URL (без /api)
  const response = await axios.post(`${AUTH_URL}/auth/login`, { email, password });
  return response.data;
};

export const getMe = async (token: string) => {
  // ✅ Используем API_URL (с /api)
  const response = await axios.get(`${API_URL}/api/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};