import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/AuthContext"; // Adjust the import path as necessary

// Functional component for councilor login
export function CouncilorLogin() {
  // Hooks for navigation and authentication
  const navigate = useNavigate();
  const { login } = useAuth(); // Destructure the login function from useAuth

  // State variables for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Event handlers for email and password input changes
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // Submit handler for login form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/CoucnilorLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // Check if login request is successful
    if (response.ok) {
      login(); // Call the login function to update isAuthenticated state
      navigate("/main"); // Navigate to /main using React Router
    } else {
      console.error("Login failed");
      // Optionally, handle login failure (e.g., showing an error message)
    }
  };

  // Render councilor login form
  return (
    <div>
      <h1>Councilor Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button type="submit">Login</button>
        <button type={"button"} onClick={() => navigate("/signup")}>
          Sign Up
        </button>
      </form>
    </div>
  );
}
