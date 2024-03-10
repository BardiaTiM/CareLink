import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/ContactList.css";

// Functional component for displaying a list of contacts
export function ContactList() {
  // State variables for user data and error message
  const [userData, setUserData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  // Retrieving user ID and role from session storage
  const loggedInUserId = sessionStorage.getItem("userId");
  const userRole = sessionStorage.getItem("userRole");

  // Effect hook to fetch user data based on user role
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let users = [];

        // Fetch users based on the user's role
        if (userRole === "USER") {
          // Fetch users connected with peers
          const peerResponse = await fetch(
            `http://localhost:8000/getUsersConnectedWithPeers/${loggedInUserId}`
          );
          if (!peerResponse.ok)
            throw new Error(
              "Network response was not ok for getUsersConnectedWithPeers"
            );

          users = await peerResponse.json();
        } else if (userRole === "PEER") {
          // Fetch peers connected with users
          const userResponse = await fetch(
            `http://localhost:8000/getPeersConnectedWithUsers/${loggedInUserId}`
          );

          if (!userResponse.ok)
            throw new Error(
              "Network response was not ok for getPeersConnectedWithUsers"
            );

          users = await userResponse.json();
        } else if (userRole === "COUNCILOR") {
          // Fetch all users and peer helpers
          const usersResponse = await fetch(
            "http://localhost:8000/getAllUsers"
          );

          if (!usersResponse.ok)
            throw new Error("Network response was not ok for getAllUsers");

          const normalUsers = await usersResponse.json();

          const peerHelpersResponse = await fetch(
            "http://localhost:8000/getAllPeerHelpers"
          );
          if (!peerHelpersResponse.ok)
            throw new Error(
              "Network response was not ok for getAllPeerHelpers"
            );

          const peerHelpers = await peerHelpersResponse.json();

          users = normalUsers.concat(peerHelpers);
        }

        // Check if the received data is an array
        if (Array.isArray(users)) {
          setUserData(users);
        } else {
          console.error("Unexpected data format received:", users);
          setErrorMessage("Unexpected data format received");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setErrorMessage(error.message);
      }
    };

    fetchUsers();
  }, [loggedInUserId, userRole]); // Trigger effect when user ID or role changes

  // Effect hook to scroll to the top when user data changes
  useEffect(() => {
    const container = document.querySelector(".contact-container");
    if (container) {
      container.scrollTop = 0;
    }
  }, [userData]); // Trigger effect when user data changes

  // Render contacts based on user role
  if (sessionStorage.getItem("userRole") === "COUNCILOR") {
    return (
      <div className="contact-container">
        {/* Render error message if exists */}
        {errorMessage && <p>{errorMessage}</p>}
        <h2 style={{ marginTop: "1700px" }}>Contact</h2>

        <div>
          {/* Render contact list */}
          {userData.map((user, index) => (
            <div className="contact-user-profile" key={user.id || index}>
              <Link
                to={`/chat/${loggedInUserId}/${user.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {user.username}
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="contact-container">
      {/* Render error message if exists */}
      {errorMessage && <p>{errorMessage}</p>}
      <h2>Contact</h2>
      <div>
        {/* Render contact list */}
        {userData.map((user, index) => (
          <div className="contact-user-profile" key={user.id || index}>
            <Link
              to={`/chat/${loggedInUserId}/${user.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {user.username}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
