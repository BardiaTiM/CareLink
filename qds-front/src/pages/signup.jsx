import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function SignUp() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');
    const [description, setDescription] = useState('');

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleRoleChange = (e) => setRole(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let userData = { username, password, email, role: 'USER' };

        if (role === 'peer') {
            userData = { ...userData, description, status: 'IN REVIEW', role: 'PEER' };
        }

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
                navigate('/login');
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
            <form onSubmit={handleSubmit} className="signup-form">
                <div>
                    <label htmlFor="role">Select Role</label>
                    <select id="role" value={role} onChange={handleRoleChange} required>
                        <option value="user">User</option>
                        <option value="peer">Peer</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        value={username}
                        onChange={handleUsernameChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email">Email (used for logging in)</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>

                {role === 'peer' && (
                    <div>
                        <label htmlFor="description">Description:</label>
                        <input
                            type="text"
                            id="description"
                            placeholder="Description"
                            value={description}
                            onChange={handleDescriptionChange}
                            required
                        />
                    </div>
                )}
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}