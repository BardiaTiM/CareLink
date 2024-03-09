import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Chat({ loggedInUserId }) {
  const [userData, setUserData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch user data
        const response = await fetch("http://localhost:8000/getAllUsers");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // Check if loggedInUserId exists in the fetched userData
        const loggedInUserExists = data.some(
          (user) => user.id === loggedInUserId
        );

        // Fetch appropriate user list based on loggedInUserId
        if (loggedInUserExists) {
          const peerHelperResponse = await fetch(
            "http://localhost:8000/getAllPeerHelpers"
          );
          if (!peerHelperResponse.ok) {
            throw new Error("Network response was not ok");
          }
          const peerHelperData = await peerHelperResponse.json();
          setUserData(peerHelperData);
        } else {
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setErrorMessage("Error fetching data. Please try again later.");
      }
    };
    fetchUsers();
  }, [loggedInUserId]);

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
