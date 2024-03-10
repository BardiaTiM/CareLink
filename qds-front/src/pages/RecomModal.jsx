import React from "react";
import { useNavigate } from "react-router-dom"; // Import hook for navigation
import "../style/recomModal.css"; // Import CSS for the modal component

export function RecomModal({ onClose, description, peerId, imageUrl }) {
    const navigate = useNavigate(); // Hook for programmatically navigating

    // Function to handle initiating a chat with a peer
    const handleStartChat = async () => {
        // Retrieve the logged-in user's ID from session storage
        const loggedInUserId = sessionStorage.getItem("userId");
        const chatUserId = peerId; // The ID of the peer to start a chat with

        try {
            // Attempt to connect the logged-in user with the selected peer via a POST request
            const response = await fetch(
                "http://localhost:8000/connectUserWithPeer",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    // Send the logged-in user's ID and the peer's ID in the request body
                    body: JSON.stringify({
                        userId: loggedInUserId,
                        peerId: chatUserId,
                    }),
                }
            );

            // Check if the response was successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Process the response (here, simply logging it to the console)
            const result = await response.text();
            console.log(result); // Log the result for debugging or further processing
            // Navigate to the chat page with both user IDs in the path
            navigate('/chat/' + loggedInUserId + '/' + chatUserId);
        } catch (error) {
            // Log any errors encountered during the fetch operation
            console.error("Error connecting user with peer:", error);
        }
    };

    // Render the modal
    return (
        // Modal overlay that closes the modal when clicked
        <div className="modal-overlay" onClick={onClose}>
            {/* Modal content box */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Display the peer's image */}
                <img src={imageUrl} alt="Person" />
                <h2>Bio</h2>
                {/* Display the peer's description */}
                <p>Description: {description}</p>
                {/* Button to initiate chat with the peer */}
                <button onClick={handleStartChat}>Start Chat</button>
            </div>
        </div>
    );
}
