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
        navigate('/'); // redirect to landing page
    };

    const handleMouseEnter = (event) => {
        event.currentTarget.querySelector('.logo-image').src = logoImageOrange;
    };

    const handleMouseLeave = (event) => {
        event.currentTarget.querySelector('.logo-image').src = logoImageWhite;
    };

    // Update this part for conditional redirection based on isAuthenticated
    const logoLink = isAuthenticated ? "/main" : "/";

    return (
        <nav className="navbar">
            {/* Updated Link component to use logoLink for conditional redirection */}
            <Link to={logoLink} className="brand logo-home" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <span className="brand-text">CareLink</span>
                <img src={logoImageWhite} alt="CareLink Logo" className="logo-image" />
            </Link>
            <ul className="navbar-nav">
                <li className="nav-item non-highlight"><Link to="/FAQ">FAQ</Link></li>
                {isAuthenticated && <li className="nav-item non-highlight"><Link to="/main">Main</Link></li>}
                {isAuthenticated && (<li className="nav-item non-highlight"><Link to="/" onClick={handleLogout}>Logout</Link></li>)}
                {isAuthenticated && CouncilorRole() && (<li className="nav-item non-highlight"><Link to="/inReview">Review Peers</Link></li>)}
            </ul>
        </nav>
    );
}
