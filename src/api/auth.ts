import axios from 'axios'

const API_URL = 'http://localhost:4000'

export const register = async (email: string, password: string, name: string) => {
  const response = await axios.post(`${API_URL}/auth/register`, { email, password, name })
  return response.data
}

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password })
  return response.data
}

export const getMe = async (token: string) => {
  const response = await axios.get(`${API_URL}/api/me`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}