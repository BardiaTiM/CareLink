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
                <div className="login-container">
                    <Login />
                </div>
            </div>

            <div className="splash-container">
                <div className="splash-content">
                    <h1>QDS</h1>
                    <p>HomePage</p>
                </div>
            </div>
        </>
    );
}