import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const navigate = useNavigate();

    // Renamed state variables for clarity
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Updated handlers to reflect we're using email now
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Updated to send email instead of username
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            navigate('/main'); // Navigate to /main using React Router
        } else {
            console.error('Login failed');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={email} // Bind input to email state
                    onChange={handleEmailChange} // Update email state on change
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={password} // Bind input to password state
                    onChange={handlePasswordChange} // Update password state on change
                />
                <button type="submit">Login</button>
                <button type={'button'} onClick={() => navigate('/signup')}>Sign Up</button>
            </form>
        </div>
    );
}
