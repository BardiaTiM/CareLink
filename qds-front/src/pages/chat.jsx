import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Chat({ loggedInUserId }) {
  const [userData, setUserData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]); // To store chat messages
  const [newMessage, setNewMessage] = useState("");

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage("");
  };

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

    // Initialize WebSocket connection
    const newSocket = new WebSocket("ws://localhost:8000"); // WebSocket server URL
    setSocket(newSocket);

    // Handle incoming WebSocket messages
    newSocket.onmessage = (event) => {
      const incomingMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
    };

    // Cleanup on component unmount
    return () => newSocket.close();
  }, []);

  // Function to send messages
  const sendMessage = (messageContent) => {
    const message = {
      from: loggedInUserId,
      content: messageContent,
      // Add other message details like timestamp, recipientId, etc.
    };
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  // Function to render messages
  const renderMessages = () => {
    return messages.map((msg, index) => (
      <div key={index}>
        <b>{msg.from === loggedInUserId ? "You" : "Other"}:</b> {msg.content}
      </div>
    ));
  };

  return (
    <div style={{ textAlign: "center" }}>
      {errorMessage && <p>{errorMessage}</p>}
      {userData.map((user) => (
        <p key={user.id}>
          <Link to={`/chat/${loggedInUserId}/${user.id}`}>{user.username}</Link>
        </p>
      ))}
      <div>
        <h2>Messages</h2>
        <div>{renderMessages()}</div>
        <div>
          <input
            type="text"
            value={newMessage}
            onChange={handleNewMessageChange}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
