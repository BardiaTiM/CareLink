// src/pages/RecomModal.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/recomePage.css";

export function RecomModal({ onClose, description, peerId }) {

    console.log("peerId: ", peerId);
  const nagivate = useNavigate();

  const handleStartChat = async () => {
    const loggedInUserId = sessionStorage.getItem("userId");
    const chatUserId = peerId;

    try {
      const response = await fetch(
        "http://localhost:8000/connectUserWithPeer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: loggedInUserId,
            peerId: chatUserId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      console.log(result); // or handle the result as needed
      nagivate('/chat/' + loggedInUserId + '/' + chatUserId);
    } catch (error) {
      console.error("Error connecting user with peer:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src="https://via.placeholder.com/400" alt="Person" />
        <h2>Bio</h2>
        <p>Description: {description}</p>
        <button onClick={handleStartChat}>Start Chat</button>
      </div>
    </div>
  );
}
