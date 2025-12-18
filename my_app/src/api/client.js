import axios from 'axios';

const api = axios.create({
    baseURL: '/', // Use Vite Proxy to avoid CORS
});

// Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: Handle 401 (Unauthorized) automatically
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - redirect to login
            localStorage.removeItem('access_token');
            // Only redirect if not already on auth pages AND not the background user fetch
            if (!window.location.pathname.startsWith('/login') &&
                !window.location.pathname.startsWith('/register') &&
                !error.config.url.includes('/auth/users/me')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
