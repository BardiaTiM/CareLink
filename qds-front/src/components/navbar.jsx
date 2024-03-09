import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Authentication/AuthContext'; // Adjust the import path as necessary
import "../style/Navbar.css";
import logoImage from '../style/images/CareLink v1 - white.png'; // Update the path

export function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to login after logout
    };

    return (
        <nav className="navbar">
            <Link to="/" className="brand logo-home">
                <span className="brand-text">CareLink</span>
                <img src={logoImage} alt="CareLink Logo" className="logo-image" />
            </Link>
            <ul className="navbar-nav">
                {isAuthenticated && <li className="nav-item non-highlight"><Link to="/main">Main</Link></li>}
                {!isAuthenticated && <li className="nav-item non-highlight"><Link to="/login">Login</Link></li>}
                {!isAuthenticated && <li className="nav-item highlight"><Link to="/signup">Get Started</Link></li>}
                {isAuthenticated && (<li className="nav-item non-highlight"><Link to="/login" onClick={handleLogout}>Logout</Link></li>)}
            </ul>
        </nav>
    );
}