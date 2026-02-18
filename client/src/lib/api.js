import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// WHY: Centralized API client to manage base URL and potential future interceptors (auth, error handling)
export default api;
