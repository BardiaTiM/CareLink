import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/AuthContext";
import "../style/Login.css";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // State for the user's role
  const [errorMessage, setErrorMessage] = useState(""); // State for storing error message

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleRoleChange = (e) => setRole(e.target.value); // Handler for role change

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message on new submission

    // Determine the endpoint based on the selected role
    let endpoint;
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

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const username = data.userID;
      //place the username in session storage
      sessionStorage.setItem("username", username);

      console.log("Login successful on frontend: ", username);
      login();
      navigate("/main");
    } else {
      // Here, instead of just logging the error, we also set the error message state
      const errorData = await response.json();
      if (errorData.error) {
        setErrorMessage("Invalid email or password");
      }
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
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
        <select value={role} onChange={handleRoleChange}>
          <option value="user">User</option>
          <option value="peer">Peer</option>
          <option value="counselor">Counselor</option>
        </select>
        <button type="submit">Login</button>
        <button
          type={"button"}
          onClick={() => navigate("/signup")}
          className="signup-button"
        >
          I don't have an account
        </button>
      </form>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
    </div>
  );
}
