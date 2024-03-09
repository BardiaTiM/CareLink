import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const getInitialAuthState = () => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
};

export const getRole = () => {
    const role = sessionStorage.getItem('role');
   console.log(role);
    return role;
}

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuthState());

    useEffect(() => {
        // Check for stored auth state in session storage on app load
        const storedAuthState = sessionStorage.getItem('isAuthenticated') === 'true';
        console.log('Restoring auth state:', storedAuthState);
        setIsAuthenticated(storedAuthState);
    }, []);

    const login = () => {
        sessionStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
    };

    const logout = () => {
        sessionStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
