import React from 'react';
import { Login } from './login'; // Import your Login component
import '../style/Global.css';
import '../style/Navbar.css';
import '../style/Index.css'; // Create a new CSS file for styling

export function LandingPage() {
  return (
    <>
      <div className="splash-page">
        {/* Splash page content */}
        <div className="splash-content">
          <h1>QDS</h1>
          <p>HomePage</p>
        </div>
      </div>
      <Login /> {/* Render the Login component */}
    </>
  );
}
