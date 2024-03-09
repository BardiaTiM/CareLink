import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PrivateChat() {
  const { loggedInUserId, chatUserId } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8000");

    newSocket.onopen = () => {
      // Inform server of the user joining the chat
      newSocket.send(
        JSON.stringify({
          type: "join",
          userId: loggedInUserId,
        })
      );
    };

    console.log("Logged In User ID:", loggedInUserId);
    console.log("Other User ID:", chatUserId);

    const chatId = `${loggedInUserId}-${chatUserId}`;
    console.log("chatId:", chatId); // Debugging line

    newSocket.onmessage = (event) => {
      try {
        const incomingMessage = JSON.parse(event.data);
        if (
          incomingMessage.chatId === `${loggedInUserId}-${chatUserId}` ||
          incomingMessage.chatId === `${chatUserId}-${loggedInUserId}`
        ) {
          setMessages((prevMessages) => [...prevMessages, incomingMessage]);
        } else {
          console.log(
            "Received message for a different chat:",
            incomingMessage
          ); // Debugging line
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    setSocket(newSocket);
    return () => newSocket.close();
  }, [loggedInUserId, chatUserId]);

  const handleSendMessage = () => {
    const message = {
      type: "message",
      chatId: `${loggedInUserId}-${chatUserId}`,
      from: loggedInUserId,
      content: newMessage,
    };

    // Update the UI immediately for the sender
    setMessages((prevMessages) => [...prevMessages, message]);

    // Send the message to the server for processing and storing in the database
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }

    // Clear the input field
    setNewMessage("");
  };

  const renderMessages = () => {
    return messages.map((msg, index) => (
      <div key={index}>
        <b>{msg.from === loggedInUserId ? "You" : "Other"}:</b> {msg.content}
      </div>
    ));
  };

  return (
    <div>
      <h2>Private Chat with {chatUserId}</h2>
      <div>{renderMessages()}</div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default PrivateChat;
