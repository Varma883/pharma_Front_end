import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

// Helper to decode JWT manually so we don't need another heavy library just for this
const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial auth check
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                const decoded = parseJwt(token);
                if (decoded) {
                    // Assuming structure: { sub: "username", role: "admin", exp: 12345 }
                    const userRole = decoded.role || 'user';
                    const userData = {
                        username: decoded.sub,
                        role: userRole,
                        isAdmin: userRole === 'admin',
                        isRoot: userRole === 'root' || userRole === 'superadmin'
                    };
                    setUser(userData);
                } else {
                    localStorage.removeItem('access_token');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await api.post('/auth/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const { access_token } = response.data;
            localStorage.setItem('access_token', access_token);

            // Decode and set user immediately
            const decoded = parseJwt(access_token);
            const userRole = decoded?.role || 'user';
            const userData = {
                username: username,
                role: userRole,
                isAdmin: userRole === 'admin',
                isRoot: userRole === 'root' || userRole === 'superadmin' // Treat superadmin as root
            };
            setUser(userData);

            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            await api.post('/auth/register', userData);
            return true;
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin,
        isRoot: user?.isRoot
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
