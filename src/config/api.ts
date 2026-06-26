// 📌 Файл конфигурации для API URL
// В development используем localhost:4000
// В production используем значение из .env.production (VITE_API_URL=/api)
// API_URL — для защищённых эндпоинтов (/api/*)
// AUTH_URL — для авторизации (/auth/*)

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const authBaseURL = import.meta.env.VITE_AUTH_URL || 'http://localhost:4000';

export const API_URL = baseURL;
export const AUTH_URL = authBaseURL;