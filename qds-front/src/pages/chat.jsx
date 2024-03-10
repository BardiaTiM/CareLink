import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Chat() {
  const [userData, setUserData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const loggedInUserId = sessionStorage.getItem('userId')
  const userRole = sessionStorage.getItem('userRole')
  console.log("loggedInUserId: ", loggedInUserId);
  console.log("userRole: ", userRole);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (userRole === "USER") {
          const peerResponse = await fetch(
            "http://localhost:8000/getAllPeerHelpers"
          );
          if (!peerResponse.ok)
            throw new Error(
              "Network response was not ok for getAllPeerHelpers"
            );

          const peerUsers = await peerResponse.json();

          const councilorResponse = await fetch(
            "http://localhost:8000/getAllCouncilors"
          );
          if (!councilorResponse.ok)
            throw new Error("Network response was not ok for getAllCouncilors");

          const councilorUsers = await councilorResponse.json();

          // Combine the two lists
          setUserData([...peerUsers, ...councilorUsers]);
        } else if (userRole === "PEER") {
          const userResponse = await fetch("http://localhost:8000/getAllUsers");
          if (!userResponse.ok)
            throw new Error("Network response was not ok for getAllUsers");

          const normalUsers = await userResponse.json();

          const councilorResponse = await fetch(
            "http://localhost:8000/getAllCouncilors"
          );
          if (!councilorResponse.ok)
            throw new Error("Network response was not ok for getAllCouncilors");

          const councilorUsers = await councilorResponse.json();

          // Combine the two lists
          setUserData([...normalUsers, ...councilorUsers]);
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

          // Combine the two lists
          setUserData([...normalUsers, ...peerHelpers]);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setErrorMessage(error.message);
      }
    };

    fetchUsers();
  }, [loggedInUserId, userRole]);

  return (
    <div style={{ textAlign: "center" }}>
      {errorMessage && <p>{errorMessage}</p>}
      <h2>Select a User to Chat With</h2>
      <div>
        {userData.map((user) => (
          <p key={user.id}>
            <Link to={`/chat/${loggedInUserId}/${user.id}`}>
              {user.username}
            </Link>
          </p>
        ))}
      </div>
    </div>
  );
}
