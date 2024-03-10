import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Authentication/AuthContext';
import "../style/Login.css";

export function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // State for the user's role
    const [errorMessage, setErrorMessage] = useState(''); // State for storing error message

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleRoleChange = (e) => setRole(e.target.value); // Handler for role change

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset error message on new submission

        // Determine the endpoint based on the selected role

        console.log("role: ", role);
        let endpoint;
        switch (role) {
            case 'user':
                endpoint = 'http://localhost:8000/login';
                break;
            case 'peer':
                endpoint = 'http://localhost:8000/peerlogin';
                break;
            case 'counselor':
                endpoint = 'http://localhost:8000/CouncilorLogin';
                break;
            default:
                endpoint = 'http://localhost:8000/login'; // Default endpoint or handle error
                break;
        }
        console.log("endpoint: ", endpoint);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const { userID, role, username } = await response.json(); // Assume backend returns role in response
            console.log("signed in userId: ", userID);
            console.log("signed in role: ", role);
            sessionStorage.setItem('userId', userID);
            sessionStorage.setItem('userRole', role);
            login();

            if (role === 'USER') {
                console.log("username: ", username);
                sessionStorage.setItem('username', username);
                navigate('/main');
            } else if (role === 'PEER') {
                navigate('/chat');
            } else if (role === 'COUNCILOR') {
                navigate('/inReview');
            }

        } else {
            // Here, instead of just logging the error, we also set the error message state
            const errorData = await response.json();
            if (errorData.error) {
                setErrorMessage("Invalid email or password");
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="signup-form">

                <div>
                    <label htmlFor="role">Select Role</label>
                    <select className='role-dropbox' value={role} onChange={handleRoleChange}>
                        <option value="user">User</option>
                        <option value="peer">Peer</option>
                        <option value="counselor">Counselor</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>

                <button type="submit">Login</button>
            </form>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        </div>
    );
}