import axios from 'axios';
import { API_URL } from '../config/api';

// 📌 Функция для получения токена из localStorage
const getToken = () => localStorage.getItem('token');

export const getTasks = async (date: string) => {
    const response = await axios.get(`${API_URL}/api/tasks?date=${date}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
    return response.data;
};

export const createTask = async (data: { title: string; date: string; type: string; order: number }) => {
    const response = await axios.post(`${API_URL}/api/tasks`, data, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
    return response.data;
};

export const updateTask = async (id: string, data: { title?: string; isDone?: boolean; order?: number }) => {
    const response = await axios.patch(`${API_URL}/api/tasks/${id}`, data, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
    return response.data;
};

export const deleteTask = async (id: string) => {
    const response = await axios.delete(`${API_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
    return response.data;
};