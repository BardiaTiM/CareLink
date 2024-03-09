import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Authentication/AuthContext'; // Adjust the import path as necessary
import "../style/Navbar.css";
import '../style/Logo.css';
import logoImageWhite from '../style/images/CareLink v1 - white.png';
import logoImageOrange from '../style/images/CareLink v1 - white + orange.png';

export function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const CouncilorRole = () => {
        return sessionStorage.getItem('userRole') === 'COUNCILOR';
    }

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to login after logout
    };

    const handleMouseEnter = (event) => {
        event.currentTarget.querySelector('.logo-image').src = logoImageOrange;
    };

    const handleMouseLeave = (event) => {
        event.currentTarget.querySelector('.logo-image').src = logoImageWhite;
    };

    return (
        <nav className="navbar">
            <Link to="/" className="brand logo-home" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
                <span className="brand-text">CareLink</span>
                <img src={logoImageWhite} alt="CareLink Logo" className="logo-image" />
            </Link>
            <ul className="navbar-nav">
                {isAuthenticated && <li className="nav-item non-highlight"><Link to="/main">Main</Link></li>}
                {/* {!isAuthenticated && <li className="nav-item non-highlight"><Link to="/login">Login</Link></li>} */}
                {!isAuthenticated && <li className="nav-item highlight"><Link to="/signup">Get Started</Link></li>}
                {isAuthenticated && (<li className="nav-item non-highlight"><Link to="/login" onClick={handleLogout}>Logout</Link></li>)}
                {isAuthenticated && CouncilorRole (<li className="nav-item non-highlight"><Link to="/inReview">Review Peers</Link></li>)}
            </ul>
        </nav>
    );
}