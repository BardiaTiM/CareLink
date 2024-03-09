import React from 'react';
import { Link } from 'react-router-dom';
import { Login } from './login';
import '../style/Navbar.css';
import '../style/Footer.css';
import '../style/Index.css';
import '../style/Global.css';

export function LandingPage() {
    return (
        <>
            <div className="landing-container">
                <div className="header-container">
                    <h1>CareLink</h1>
                    <h3 className="header-title">Find Support Anonymously with CareLink - Matched by AI, Monitored by Counselors</h3>
                </div>
            </div>

            <div className="contcont">
                <div className="four-column-grid">
                    <div className="splash-container">
                        <h2>Discover Your Support Network</h2>
                        <p>Connect anonymously with peers facing similar challenges, fostering a community that goes beyond mental health. Your support journey starts here.</p>
                    </div>

                    <div className="splash-container">
                        <h2>Smart Matches, Real Oversight</h2>
                        <p>Experience AI-driven matching that pairs you with the right counselors or peers. All interactions are overseen by real counselors, ensuring a safe and effective support system.</p>
                    </div>

                    <div className="splash-container">
                        <h2>Comprehensive Security for BCIT Students</h2>
                        <p>BCIT CareLink - where security meets support. Exclusive to BCIT students, with enhanced measures like email verification and counselor approval for meetups. Your well-being is our top priority.</p>
                    </div>

                    <div className="splash-container">
                        <h2>Start Your Journey with Confidence</h2>
                        <p>Begin your journey to well-being confidently, knowing BCIT CareLink is your exclusive, secure, and comprehensive support network. We're here for you every step of the way.</p>
                    </div>
                </div>
            </div>


            <div className="call-to-action-container">
                <h1>Get started with CareLink</h1>
                <Link to="/signup" className="get-started-button">Get Started</Link>
            </div>

            <footer className="footer">
                <div className="footer-content">
                    <p>&copy; 2024 BCIT CareLink. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}
