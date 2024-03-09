import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Authentication/AuthContext';

export const PrivateRoute = ({ children, requiredRole }) => {
    const { isAuthenticated } = useAuth();
    const userRole = sessionStorage.getItem('userRole');

    // Check both authentication and if the required role matches the user's role
    const hasRequiredRole = requiredRole ? userRole === requiredRole : true;

    // If the user is authenticated but does not have the required role, redirect to the main page
    if (isAuthenticated && !hasRequiredRole) {
        return <Navigate to="/main" />;
    }

    // If the user is authenticated and has the required role (or no specific role is required), render the children
    return isAuthenticated && hasRequiredRole ? children : <Navigate to="/login" />;
};
