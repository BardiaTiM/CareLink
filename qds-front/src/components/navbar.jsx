import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Authentication/AuthContext'; // Adjust the import path as necessary
import "../style/Navbar.css";
import '../style/Logo.css';
import logoImageWhite from '../style/images/CareLink v1 - white.png';
import logoImageOrange from '../style/images/CareLink v1 - white + orange.png';
import chatIcon from '../style/images/icons/chat.png';
import faqIcon from '../style/images/icons/faq.png';
import logoutIcon from '../style/images/icons/logout.png';

export function Navbar() {
    const { isAuthenticated, logout } = useAuth();
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
        switch (userRole) {
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
                <li className="nav-item non-highlight">
                    <Link to="/FAQ">
                        <span className="desktop-view">FAQ</span>
                        <img src={faqIcon} alt="FAQ" className="mobile-view" />
                    </Link>
                </li>
                {isAuthenticated && (
                    <>
                        {userRole === 'PEER' && (
                            <li className="nav-item non-highlight">
                                <Link to="/chat">
                                    <span className="desktop-view">Chat</span>
                                    <img src={chatIcon} alt="Chat" className="mobile-view" />
                                </Link>
                            </li>
                        )}
                        <li className="nav-item non-highlight">
                            <Link to="/" onClick={handleLogout}>
                                <span className="desktop-view">Logout</span>
                                <img src={logoutIcon} alt="Logout" className="mobile-view" />
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}