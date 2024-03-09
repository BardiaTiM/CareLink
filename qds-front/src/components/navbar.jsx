import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Authentication/AuthContext'; // Adjust the import path as necessary
import "../style/Navbar.css";

export function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to login after logout
    };

    return (
        <nav className="navbar">
            <ul className="navbar-nav">
                <li className="nav-item"><Link to="/">Home</Link></li>
                {!isAuthenticated && <li className="nav-item"><Link to="/login">Login</Link></li>}
                <li className="nav-item"><Link to="/main">Main</Link></li>
                {isAuthenticated && (
                    <li className="nav-item">
                        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, font: 'inherit' }}>Logout</button>
                    </li>
                )}

            </ul>
        </nav>
    );
}
