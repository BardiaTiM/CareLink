import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/recomModal.css"; // Import the new CSS file

export function RecomModal({ onClose, description, peerId, imageUrl }) {
  const navigate = useNavigate();

  const handleStartChat = async () => {
    const loggedInUserId = sessionStorage.getItem("userId");
    const chatUserId = peerId;

    // Ensure loggedInUserId is not null or undefined
    if (loggedInUserId && loggedInUserId !== "USER") {
      try {
        const peerResponse = await fetch(
          `http://localhost:8000/checkGPTPeerDuplicate/${loggedInUserId}/${chatUserId}`
        );

        if (!peerResponse.ok) {
          throw new Error("Network response was not ok");
        }

        const alreadyConnectedWithPeer = await peerResponse.json();

        if (!alreadyConnectedWithPeer) {
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
        }

        navigate("/chat/" + loggedInUserId + "/" + chatUserId);

      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Person" />
        <h2>Bio</h2>
        <p>Description: {description}</p>
        <button onClick={handleStartChat}>Start Chat</button>
      </div>
    </div>
  );
}
