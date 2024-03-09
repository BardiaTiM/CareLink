import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/navbar';
import { LandingPage } from './pages/index';
import { Login } from './pages/login';
import { MainPage } from './pages/mainPage'; // Import the MainPage component

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/main" element={<MainPage />} /> {/* Add this route for the MainPage */}
            </Routes>
        </Router>
    );
}

export default App;