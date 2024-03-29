// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Authentication/AuthContext';
import { Navbar } from './components/navbar';
import { LandingPage } from './pages/index';
import { PrivateRoute } from './routing/PrivateRoute';
import { SignUp } from './pages/signup';
import { CouncilorLogin } from './pages/councilorLogin';
import { Main } from "./pages/main";
import { InReview } from "./pages/inReview";
import Chat from './pages/chat';
import PrivateChat from './pages/privateChat';
import { NotFound } from './pages/404';
import { RecomPage } from './pages/RecomPage';
import {FAQ } from './pages/faq';

// This is the main component that will be rendered by the index.js file and will contain all
// the routes for the application
function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/signup" element={<SignUp />} />
                    {/*<Route path="/login" element={<Login />} />*/}
                    <Route path="/main" element={<PrivateRoute requiredRole="USER"><Main /></PrivateRoute>} />
                    <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
                    <Route path="/chat/:loggedInUserId/:chatUserId" element={<PrivateRoute><PrivateChat /></PrivateRoute>} />
                    <Route path="/councilorLogin" element={<CouncilorLogin />} />
                    <Route path="/inReview" element={<PrivateRoute requiredRole="COUNCILOR"><InReview /></PrivateRoute>} />
                    <Route path="/recomPage" element={<PrivateRoute><RecomPage /></PrivateRoute>} />
                    <Route path="/faq" element ={<FAQ />} />
                    {/* Add the route for the Problem component */}
                    <Route path="*" element={<NotFound />} />

                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
