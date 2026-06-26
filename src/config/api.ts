// 📌 Файл конфигурации для API URL
// В development используем localhost:4000
// В production используем значение из .env.production (VITE_API_URL=/api)
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';