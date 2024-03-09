import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Navbar} from './components/navbar';
import {LandingPage} from './pages/index';
import {Login} from './pages/login';

function App() {
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/login" element={<Login />}/>
            </Routes>
        </Router>
    );
}

export default App;