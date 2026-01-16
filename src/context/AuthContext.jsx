import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

const getUserFromCookie = () => {
    const user = Cookies.get('user');
    if (!user || user === 'undefined') return null;
    try {
        return JSON.parse(user);
    } catch (e) {
        console.error("Error parsing user cookie:", e);
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('token'));
    const [userRole, setUserRole] = useState(() => {
        const user = getUserFromCookie();
        return user ? user.role : null;
    });

    useEffect(() => {
        const updateAuthStatus = () => {
            const token = Cookies.get('token');
            const user = getUserFromCookie();
            setIsAuthenticated(!!token);
            setUserRole(user ? user.role : null);
        };

        updateAuthStatus();

        window.addEventListener('storage', updateAuthStatus);

        return () => {
            window.removeEventListener('storage', updateAuthStatus);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userRole, setUserRole }}>
            {children}
        </AuthContext.Provider>
    );
};
