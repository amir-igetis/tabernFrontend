// contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants/Constants';
import { setupAxiosInterceptors } from '../utils/axiosInterceptor';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Start with loading true
    const [error, setError] = useState('');

    // Check if user is logged in on app start
    // contexts/AuthContext.jsx - Add this to the useEffect
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } catch (err) {
                console.error('Error parsing user data:', err);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);

        // Setup interceptors
        setupAxiosInterceptors(logout);
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/login`, {
                email,
                password
            });

            const { token, ...userData } = response.data;

            // Store in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            // Set axios header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(userData);
            setLoading(false);
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed';
            setError(errorMessage);
            setLoading(false);
            return { success: false, error: errorMessage };
        }
    };

    const signup = async (userData) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/signup`, userData);
            setLoading(false);
            return { success: true, data: response.data };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Signup failed';
            setError(errorMessage);
            setLoading(false);
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Clear axios header
        delete axios.defaults.headers.common['Authorization'];

        setUser(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        signup,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};