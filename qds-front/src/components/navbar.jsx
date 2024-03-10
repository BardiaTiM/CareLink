import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Authentication/AuthContext'; // Adjust the import path as necessary
import "../style/Navbar.css";
import '../style/Logo.css';
import logoImageWhite from '../style/images/CareLink v1 - white.png';
import logoImageOrange from '../style/images/CareLink v1 - white + orange.png';

export function Navbar() {
    const { isAuthenticated,logout } = useAuth();
    const navigate = useNavigate();
    const userRole = sessionStorage.getItem('userRole');

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

    // Determine the redirection path based on the user's role
    const getLogoLink = () => {
        if (!isAuthenticated) return "/";
        switch(userRole) {
            case 'USER':
                return "/main";
            case 'PEER':
                return "/chat";
            case 'COUNCILOR':
                return "/inReview";
            default:
                return "/";
        }
    };

    // Use the function to set the logo link dynamically
    const logoLink = getLogoLink();

    return (
        <nav className="navbar">
            <Link to={logoLink} className="brand logo-home" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <span className="brand-text">CareLink</span>
                <img src={logoImageWhite} alt="CareLink Logo" className="logo-image" />
            </Link>
            <ul className="navbar-nav">
                <li className="nav-item non-highlight"><Link to="/FAQ">FAQ</Link></li>
                {isAuthenticated && userRole === 'USER' &&  <li className="nav-item non-highlight"><Link to="/main">Main</Link></li>}
                {isAuthenticated && (<li className="nav-item non-highlight"><Link to="/" onClick={handleLogout}>Logout</Link></li>)}
                {isAuthenticated && userRole === 'COUNCILOR' && (<li className="nav-item non-highlight"><Link to="/inReview">Review Peers</Link></li>)}
                {isAuthenticated && (<li className="nav-item non-highlight"><Link to="/chat">Chat</Link></li>)}
            </ul>
        </nav>
    );
}
