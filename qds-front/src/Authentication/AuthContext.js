// Code: Authentication context to manage user authentication state
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Custom hook that allows consumers to subscribe to auth context changes
export const useAuth = () => useContext(AuthContext);

// Helper function to get the initial auth state from session storage
const getInitialAuthState = () => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
};
// Helper function to get the role from session storage
export const getRole = () => {
    const role = sessionStorage.getItem('role');
   console.log(role);
    return role;
}

// Provider component that wraps the entire app and provides auth state and actions
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuthState());

    useEffect(() => {
        // Check for stored auth state in session storage on app load
        const storedAuthState = sessionStorage.getItem('isAuthenticated') === 'true';
        console.log('Restoring auth state:', storedAuthState);
        setIsAuthenticated(storedAuthState);
    }, []);

    // Function to set the auth state to authenticated
    const login = () => {
        sessionStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
    };

    // Function to set the auth state to unauthenticated
    const logout = () => {
        sessionStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
    };

    // Return the provider component with the auth state and actions
    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
