import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function SignUp() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user'); // State to keep track of the selected role
    const [description, setDescription] = useState(''); // Additional state for the description when role is 'peer'

    // Handlers for input changes
    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleRoleChange = (e) => setRole(e.target.value); // Handler for role change
    const handleDescriptionChange = (e) => setDescription(e.target.value); // Handler for description change

    const handleSubmit = async (e) => {
        e.preventDefault();
        let userData = { username, password, email };

        if (role === 'peer') {
            userData = { ...userData, description, status: 'IN REVIEW' }; // Include description for 'peer'
        }

        // Determine the endpoint based on the selected role
        const endpoint = role === 'peer' ? 'http://localhost:8000/peersignup' : 'http://localhost:8000/signup';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                console.log("Signup successful");
                navigate('/login'); // Navigate to login page after successful signup
            } else {
                const errorData = await response.json();
                console.error("Signup failed:", errorData.message);
            }
        } catch (error) {
            console.error('Request failed:', error);
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <select value={role} onChange={handleRoleChange} required>
                    <option value="user">User</option>
                    <option value="peer">Peer</option>
                </select>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                />
                {role === 'peer' && (
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={handleDescriptionChange}
                        required
                    />
                )}
                <button type="submit">Sign Up</button>
                <button type={'button'} onClick={() => navigate('/login')} className="signup-button">I already have an account</button>
            </form>
        </div>
    );
}
