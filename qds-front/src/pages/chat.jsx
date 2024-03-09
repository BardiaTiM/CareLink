import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Chat({ loggedInUserId }) {
  const [userData, setUserData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    // Fetch user data
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/getAllUsers");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        setErrorMessage("Error fetching users. Please try again later.");
      }
    };
    fetchUsers();
  }, []);

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
