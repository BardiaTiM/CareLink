import React from 'react';
import { Link } from 'react-router-dom';
import { SignUp } from './signup'; // Import the Login component
import '../style/Navbar.css';
import '../style/Footer.css';
import '../style/Index.css';
import '../style/Global.css';
import '../style/Logo.css';
import logoImageWhite from '../style/images/CareLink v1 - white.png';
import logoImageColor from '../style/images/CareLink v1 - color.png';
import logoImageOrange from '../style/images/CareLink v1 - white + orange.png';
import headerBackgroundImage from '../style/images/people-2.jpg';

export function LandingPage() {

    const handleMouseEnter = (event) => {
        event.currentTarget.querySelector('.logo-image-2').src = logoImageOrange;
    };

    const handleMouseLeave = (event) => {
        event.currentTarget.querySelector('.logo-image-2').src = logoImageWhite;
    };

    return (
        <>
            <div className="header-container header-image-container" style={{ backgroundImage: `url(${headerBackgroundImage})` }}>
                <div className="header-image-columns">
                    {/* Left column */}
                    <div className="header-image-column">
                        <div className="header-motto-container">
                            <h1>
                                Find Support Anonymously
                            </h1>
                            <br />
                            <h3>
                                Matched by AI,
                                <br />
                                Monitored by Counselors
                            </h3>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="header-image-column">
                        <div className="header-text-container">
                            <img src={logoImageColor} alt="CareLink Logo" className="logo-image-2" />
                            {/* <h1 className="black-text">CareLink</h1> */}
                            <SignUp />
                        </div>
                    </div>
                </div>
            </div>

            <div className="call-to-action-container">
                <h1>The Social Support Network</h1>
            </div>

            <div className="grid-container">
                <div className="four-column-grid">
                    <div className="splash-container">
                        <h2>Discover Your Support Network</h2>
                        <p>Connect anonymously with peers facing similar challenges, fostering a community that goes beyond mental health.
                            Your support journey starts here.</p>
                    </div>

                    <div className="splash-container">
                        <h2>Smart Matches, Real Oversight</h2>
                        <p>Experience AI-driven matching that pairs you with the right counselors or peers.
                            All interactions are overseen by real counselors, ensuring a safe and effective support system.</p>
                    </div>

                    <div className="splash-container">
                        <h2>Empowering Well-being at BCIT</h2>
                        <p>Discover BCIT CareLink - Elevating your security and support.
                            Tailored for BCIT students, our platform implements stringent measures including email verification and counselor approval for meetups.
                        </p>
                    </div>

                    <div className="splash-container">
                        <h2>Start Your Journey with Confidence</h2>
                        <p>Begin your journey to well-being confidently, knowing BCIT CareLink is your exclusive, secure, and comprehensive support network.
                            We're here for you every step of the way.</p>
                    </div>
                </div>
            </div>

            <div className="call-to-action-container">
                <h1>Get started with CareLink</h1>
                <Link to="/signup" className="get-started-button">Get Started</Link>
            </div>

            <footer className="footer">
                <div className="footer-content">
                    <p>&copy; 2024 CareLink. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}