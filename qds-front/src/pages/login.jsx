import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/AuthContext"; // Import the useAuth hook
import "../style/Login.css"; // Import the component's CSS file

// Functional component for the login form
export function Login() {
  const navigate = useNavigate(); // Hook for navigation
  const { login } = useAuth(); // Destructure the login function from useAuth hook

  // State variables for email, password, role, and error message
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [errorMessage, setErrorMessage] = useState("");

  // Event handlers for input changes
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleRoleChange = (e) => setRole(e.target.value);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setErrorMessage(""); // Reset error message on new submission

    let endpoint; // Variable to store the API endpoint for login

    // Determine the endpoint based on the selected role
    switch (role) {
      case "user":
        endpoint = "http://localhost:8000/login";
        break;
      case "peer":
        endpoint = "http://localhost:8000/peerlogin";
        break;
      case "counselor":
        endpoint = "http://localhost:8000/CouncilorLogin";
        break;
      default:
        endpoint = "http://localhost:8000/login"; // Default endpoint or handle error
        break;
    }

    // Send a POST request to the selected endpoint with email and password
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // If the response is successful, extract user ID and role from the response
      const { userID, role } = await response.json();
      // Store user ID and role in session storage
      sessionStorage.setItem("userId", userID);
      sessionStorage.setItem("userRole", role);
      // Call the login function from useAuth hook to update authentication status
      login();

      // Redirect users based on their roles
      if (role === "USER") {
        navigate("/main");
      } else if (role === "PEER") {
        navigate("/chat");
      } else if (role === "COUNCILOR") {
        navigate("/inReview");
      }
    } else {
      // If the response is not ok, set the error message state
      const errorData = await response.json();
      if (errorData.error) {
        setErrorMessage("Invalid email or password");
      }
    }
  };

  // Render the login form and error message if present
  return (
    <div>
      <form onSubmit={handleSubmit} className="signup-form">
        {/* Dropdown to select user role */}
        <div>
          <label htmlFor="role">Select Role</label>
          <select
            className="role-dropbox"
            value={role}
            onChange={handleRoleChange}
          >
            <option value="user">User</option>
            <option value="peer">Peer</option>
            <option value="counselor">Counselor</option>
          </select>
        </div>

        {/* Input field for email */}
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

        {/* Input field for password */}
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

        {/* Submit button */}
        <button type="submit">Login</button>
      </form>

      {/* Display error message if present */}
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
    </div>
  );
}
