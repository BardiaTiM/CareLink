import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:8081/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
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
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={username} // Bind input to state
                    onChange={handleUsernameChange} // Update state on change
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={password} // Bind input to state
                    onChange={handlePasswordChange} // Update state on change
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
