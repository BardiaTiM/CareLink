import React from 'react';
import { Login } from './login';
import '../style/Navbar.css';
import '../style/Index.css';
import '../style/Global.css';

export function LandingPage() {
    return (
        <>
            <div className="header-container">
                <h1>Header</h1>
            </div>
            <div className="splash-container">
                <div className="splash-content">
                    <h1>QDS</h1>
                    <p>HomePage</p>
                </div>
            </div>
            <Login />
        </>
    );
}