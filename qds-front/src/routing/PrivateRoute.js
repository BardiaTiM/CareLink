import {Navigate} from "react-router-dom";
import {useAuth} from "../Authentication/AuthContext";

export const PrivateRoute = ({ children, requiredRole }) => {
    const { isAuthenticated } = useAuth();
    const userRole = sessionStorage.getItem('userRole');

    // Check both authentication and if the required role matches the user's role
    const hasRequiredRole = requiredRole ? userRole === requiredRole : true;

    // Redirect logic adjustment
    if (!isAuthenticated) {
        return <Navigate to="/" />;
    } else if (isAuthenticated && !hasRequiredRole) {
        return <Navigate to="/unauthorized" />; // Consider adding an Unauthorized component or another suitable redirect
    }

    // If the user is authenticated and has the required role (or no specific role is required), render the children
    return children;
};
