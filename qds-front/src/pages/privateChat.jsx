import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MessageList } from "../components/messageList";
import "../style/PrivateChat.css";

function PrivateChat() {
  const { loggedInUserId, chatUserId } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverUserName, setReceiverUserName] = useState("");

  // Function to fetch message history
  const fetchMessageHistory = async () => {
    try {
      // This should be your API endpoint that returns the chat history between loggedInUserId and chatUserId
      const response = await fetch(
        `http://localhost:8000/getChatHistory/${loggedInUserId}/${chatUserId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const history = await response.json();
      // Ensure each message has a sender_id field
      const formattedHistory = history.map((msg) => ({
        ...msg,
        from: msg.sender_id,
      }));
      setMessages(formattedHistory);
    } catch (error) {
      console.error("Error fetching message history:", error);
    }
  };

  // Function to fetch the receiver's username
  const fetchReceiverUserName = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/getUserNameById/${chatUserId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.username;
    } catch (error) {
      console.error("Error fetching receiver's username:", error);
    }
  };

  useEffect(() => {
    fetchReceiverUserName(chatUserId)
      .then((username) => {
        // Assuming receiverUserName is a state variable
        setReceiverUserName(username);
      })
      .catch((error) => {
        console.error("Error fetching receiver username:", error);
      });
    fetchMessageHistory();
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
      message_text: newMessage, // Add this line
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
      <div
        key={index}
        className={`message-container ${
          msg.from === loggedInUserId
            ? "from-user-container"
            : "from-other-container"
        }`}
      >
        {msg.from !== loggedInUserId && (
          <div className="message-username">{receiverUserName}</div>
        )}
        <div
          className={`message-bubble ${
            msg.from === loggedInUserId ? "from-user" : "from-other"
          }`}
        >
          {msg.message_text}
        </div>
      </div>
    ));
  };

  return (
    <div className="main-container">
      <MessageList />
      <div className="chat-container">
        <div className="messages-container">{renderMessages()}</div>
        <div className="input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="message-input"
          />
          <button onClick={handleSendMessage} className="send-button">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrivateChat;
