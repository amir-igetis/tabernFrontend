// utils/axiosInterceptor.js
import axios from 'axios';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export const setupAxiosInterceptors = (logout, refreshToken) => {
    // Request interceptor
    axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor
    axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axios(originalRequest);
                    }).catch(err => {
                        return Promise.reject(err);
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const newToken = await refreshToken();
                    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    
                    processQueue(null, newToken);
                    return axios(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    logout();
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            // Handle other errors
            if (error.response?.status === 403) {
                console.error('Access forbidden');
            } else if (error.response?.status >= 500) {
                console.error('Server error occurred');
            }

            return Promise.reject(error);
        }
    );
};