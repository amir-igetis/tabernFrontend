// hooks/useApi.js
import { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants/Constants';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiCall = async (method, url, data = null) => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const config = {
                method,
                url: `${BASE_URL}${url}`,
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                data,
            };

            const response = await axios(config);
            setLoading(false);
            return { data: response.data, error: null };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Request failed';
            setError(errorMessage);
            setLoading(false);
            return { data: null, error: errorMessage };
        }
    };

    return { apiCall, loading, error };
};