import React from 'react';
import { Login } from './login';
import '../style/Navbar.css';
import '../style/Index.css';
import '../style/Global.css';

import beachImage from '../style/images/beach.jpg'; // Import the beach image

export function LandingPage() {
    return (
        <>
            <div className="header-container">
                <h1 className="header-title">Placeholder</h1>
            </div>
            <Login />
            <div className="splash-container">
                <div className="splash-content">
                    <h1>QDS</h1>
                    <p>HomePage</p>
                </div>
            </div>
        </>
    );
}