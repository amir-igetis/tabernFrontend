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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Check if user is logged in on app start and validate token
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                try {
                    // Verify token is still valid
                    const isValid = await validateToken(storedToken);
                    if (isValid) {
                        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                        const parsedUser = JSON.parse(storedUser);
                        setUser(parsedUser);
                        setToken(storedToken);
                    } else {
                        // Token is invalid, clear storage
                        clearAuthData();
                    }
                } catch (err) {
                    console.error('Token validation error:', err);
                    clearAuthData();
                }
            }
            setLoading(false);

            // Setup interceptors
            setupAxiosInterceptors(logout, refreshToken);
        };

        initAuth();
    }, []);

    // Validate token with server
    const validateToken = async (tokenToValidate) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/auth/validate`, {
                headers: {
                    'Authorization': `Bearer ${tokenToValidate}`
                }
            });
            return response.data.valid;
        } catch (error) {
            return false;
        }
    };

    // Refresh token function
    const refreshToken = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/refresh`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const { token: newToken, ...userData } = response.data;

            // Update storage and state
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            setToken(newToken);
            setUser(userData);

            return newToken;
        } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
            throw error;
        }
    };

    // Clear all auth data
    const clearAuthData = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setToken(null);
    };

    const login = async (email, password) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/login`, {
                email,
                password
            });

            const { token: newToken, ...userData } = response.data;

            // Store in localStorage
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));

            // Set axios header
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            setUser(userData);
            setToken(newToken);
            setLoading(false);
            setError('');
            
            return { success: true, user: userData };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error || 
                               'Login failed. Please check your credentials.';
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
            
            // Auto-login after successful signup
            const { token: newToken, ...userDataResponse } = response.data;
            
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userDataResponse));
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            
            setUser(userDataResponse);
            setToken(newToken);
            setLoading(false);
            setError('');
            
            return { success: true, user: userDataResponse };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error || 
                               'Signup failed. Please try again.';
            setError(errorMessage);
            setLoading(false);
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        // Optional: Call logout endpoint to invalidate token on server
        if (token) {
            axios.post(`${BASE_URL}/api/auth/logout`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).catch(err => {
                console.error('Logout API call failed:', err);
            });
        }

        clearAuthData();
        setError('');
    };

    const updateUserProfile = async (updatedData) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/auth/profile`, updatedData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const updatedUser = response.data;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            return { success: true, user: updatedUser };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Profile update failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            await axios.put(`${BASE_URL}/api/auth/change-password`, {
                currentPassword,
                newPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setError('');
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Password change failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const clearError = () => {
        setError('');
    };

    const hasRole = (role) => {
        return user?.roles?.includes(role) || false;
    };

    const hasPermission = (permission) => {
        return user?.permissions?.includes(permission) || false;
    };

    const value = {
        user,
        token,
        loading,
        error,
        isAuthenticated: !!user && !!token,
        login,
        signup,
        logout,
        updateUserProfile,
        changePassword,
        clearError,
        hasRole,
        hasPermission,
        refreshToken
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for protected routes
export const useProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    
    return {
        canAccess: isAuthenticated,
        isLoading: loading,
        redirectTo: '/login'
    };
};