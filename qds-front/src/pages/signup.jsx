import React, { useState } from 'react';

export function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');
    const [description, setDescription] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Modified to store the success message text

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleRoleChange = (e) => setRole(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);


    const handleSubmit = async (e) => {
        e.preventDefault();
        let userData = { username, password, email, role: role.toUpperCase() };

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
                // Debugging log to check which message should be set
                console.log("Signup successful, role:", role);
                console.log("sign up check", role === 'peer');
                // Set the success message based on the role
                const message = role === 'peer'
                    ? "Thank you for signing up as a peer, your credentials will be reviewed."
                    : "Signup successful. Please login with your created credentials.";

                console.log("message: ", message);
                setSuccessMessage(message);
            } else {
                const errorData = await response.json();
                console.error("Signup failed:", errorData.message);
                setSuccessMessage(''); // Clear the message in case of an error
            }
        } catch (error) {
            console.error('Request failed:', error);
            setSuccessMessage(''); // Clear the message in case of an error
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
            {successMessage && (
                <div>
                    <p>{successMessage}</p>
                    <br />
                </div>
            )}
        </div>
    );
}
