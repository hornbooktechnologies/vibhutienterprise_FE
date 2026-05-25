import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { user: userDataFromApi, token } = response.data.data;

            const userData = { ...userDataFromApi, token };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const hasPermission = (permissionSlug) => {
        if (!user) return false;
        const userRole = (user.role || '').toLowerCase();

        // Admin has full access
        if (userRole === 'admin') return true;

        // User role checks base permissions array
        return (user.permissions || []).includes(permissionSlug);
    };

    const hasAnyPermission = (permissionSlugs = []) => {
        if (!permissionSlugs || permissionSlugs.length === 0) return false;
        return permissionSlugs.some((permissionSlug) => hasPermission(permissionSlug));
    };

    return (
        <AuthContext.Provider value={{ user, token: user?.token, login, logout, loading, hasPermission, hasAnyPermission }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
