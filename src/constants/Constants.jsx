// constants/Constants.js
// export const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export const BASE_URL = 'http://localhost:8080';


// User roles
export const ROLES = {
    ADMIN: 'ROLE_ADMIN',
    MANAGER: 'ROLE_MANAGER',
    USER: 'ROLE_USER'
};

// Permissions
export const PERMISSIONS = {
    MANAGE_CATEGORIES: 'MANAGE_CATEGORIES',
    MANAGE_PRODUCTS: 'MANAGE_PRODUCTS',
    MANAGE_USERS: 'MANAGE_USERS',
    VIEW_REPORTS: 'VIEW_REPORTS'
};

// Local storage keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    THEME: 'theme',
    LANGUAGE: 'language'
};