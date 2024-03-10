import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/ContactList.css";

export function ContactList() {
  const [userData, setUserData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const loggedInUserId = sessionStorage.getItem("userId");
  const userRole = sessionStorage.getItem("userRole");
  console.log("loggedInUserId: ", loggedInUserId);
  console.log("userRole: ", userRole);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let users = [];

        if (userRole === "USER") {
          const peerResponse = await fetch(
            `http://localhost:8000/getUsersConnectedWithPeers/${loggedInUserId}`
          );
          if (!peerResponse.ok)
            throw new Error(
              "Network response was not ok for getUsersConnectedWithPeers"
            );

          users = await peerResponse.json();

          // Combine the two lists
        } else if (userRole === "PEER") {
          console.log("fetching peers");
          const userResponse = await fetch(
            `http://localhost:8000/getPeersConnectedWithUsers/${loggedInUserId}`
          );

          if (!userResponse.ok)
            throw new Error(
              "Network response was not ok for getPeersConnectedWithUsers"
            );

          users = await userResponse.json();
        } else if (userRole === "COUNCILOR") {
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
  }, [loggedInUserId, userRole]);

  useEffect(() => {
    const container = document.querySelector(".contact-container");
    if (container) {
      container.scrollTop = 0;
    }
  }, [userData]);

  if (sessionStorage.getItem("userRole") === "COUNCILOR") {
    return (
      <div className="contact-container">
        {errorMessage && <p>{errorMessage}</p>}
        <h2 style={{ marginTop: "1700px" }}>Contact</h2>

        <div>
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
      {errorMessage && <p>{errorMessage}</p>}
      <h2>Contact</h2>
      <div>
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
