import React from 'react';
import { Login } from './login';
import '../style/Navbar.css';
import '../style/Index.css';
import '../style/Global.css';

export function LandingPage() {
    return (
        <>
            <div className="landing-container">
                <div className="header-container">
                    <h1 className="header-title">Placeholder</h1>
                </div>
            </div>

            {/* Section 1: Discover Your Support Network */}
            <div className="splash-container">
                <h2>Discover Your Support Network</h2>
                <p>Connect anonymously with peers facing similar challenges, fostering a community that goes beyond mental health. Your support journey starts here.</p>
            </div>

            {/* Section 2: Smart Matches, Real Oversight */}
            <div className="splash-container">
                <h2>Smart Matches, Real Oversight</h2>
                <p>Experience AI-driven matching that pairs you with the right counselors or peers. All interactions are overseen by real counselors, ensuring a safe and effective support system.</p>
            </div>

            {/* Section 3: Comprehensive Security for BCIT Students */}
            <div className="splash-container">
                <h2>Comprehensive Security for BCIT Students</h2>
                <p>BCIT CareLink - where security meets support. Exclusive to BCIT students, with enhanced measures like email verification and counselor approval for meetups. Your well-being is our top priority.</p>
            </div>

            {/* Section 4: More Than Mental Health */}
            <div className="splash-container">
                <h2>More Than Mental Health</h2>
                <p>Beyond mental health, we address a spectrum of challenges. Join us for a supportive, inclusive environment tailored to your unique needs.</p>
            </div>

            {/* Section 5: Start Your Journey with Confidence */}
            <div className="splash-container">
                <h2>Start Your Journey with Confidence</h2>
                <p>Begin your journey to well-being confidently, knowing BCIT CareLink is your exclusive, secure, and comprehensive support network. We're here for you every step of the way.</p>
            </div>
        </>
    );
}
