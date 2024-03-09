// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Authentication/AuthContext';
import { Navbar } from './components/navbar';
import { LandingPage } from './pages/index';
import { Login } from './pages/login';
import { PrivateRoute } from './routing/PrivateRoute';
import { SignUp } from './pages/signup';
import { CouncilorLogin } from './pages/councilorLogin';
import { Main } from "./pages/main";
import { InReview } from "./pages/inReview";
import Chat from './pages/chat';
import PrivateChat from './pages/privateChat';
import { NotFound } from './pages/404';
import { RecomPage } from './pages/RecomPage';

// Import the Problem component
import { Problem } from './pages/problem';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/main" element={<PrivateRoute><Main /></PrivateRoute>} />
                    <Route path="/chat" element={<Chat loggedInUserId={sessionStorage.getItem("username")} />} />
                    <Route path="/chat/:loggedInUserId/:chatUserId" element={<PrivateChat />} />
                    <Route path="/councilorLogin" element={<CouncilorLogin />} />
                    <Route path="/inReview" element={<PrivateRoute><InReview /></PrivateRoute>} />
                    <Route path="/recomPage" element={<PrivateRoute><RecomPage /></PrivateRoute>} />
                    {/* Add the route for the Problem component */}
                    <Route path="/problem" element={<PrivateRoute><Problem /></PrivateRoute>} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
