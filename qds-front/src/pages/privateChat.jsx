import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ContactList } from "../components/contactList";
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
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
    const now = new Date(); // Get the current time
    const message = {
      type: "message",
      chatId: `${loggedInUserId}-${chatUserId}`,
      from: loggedInUserId,
      content: newMessage,
      message_text: newMessage,
      time_stamp: now.toISOString(), // Add a valid timestamp
    };
  
    // Update the UI immediately for the sender with the valid timestamp
    setMessages(prevMessages => [...prevMessages, { ...message, time_stamp: now.toISOString() }]);
  
    // Send the message to the server for processing and storing in the database
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  
    // Clear the input field
    setNewMessage("");
  };
  

  const messagesEndRef = useRef(null); // Create a ref

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderMessages = () => {
    const messageElements = [];
    let lastDate;

    messages.forEach((msg, index) => {
      const msgDate = new Date(msg.time_stamp).toDateString();
      // Create a unique key for the date separator
      const dateKey = `date-${msgDate}`;
      if (msgDate !== lastDate) {
        // This message starts a new day
        messageElements.push(
          <div key={dateKey} className="date-separator">
            {msgDate}
          </div>
        );
        lastDate = msgDate;
      }

      // Create a unique key for each message
      const messageKey = `msg-${index}-${msg.time_stamp}`;
      // Push your message bubble
      messageElements.push(
        <div
          key={messageKey}
          className={`message-container ${
            msg.from === loggedInUserId
              ? "from-user-container"
              : "from-other-container"
          }`}
        >
          {msg.from !== loggedInUserId && (
            <div className="message-time">
              {new Date(msg.time_stamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
          <div
            className={`message-bubble ${
              msg.from === loggedInUserId ? "from-user" : "from-other"
            }`}
          >
            {msg.message_text}
          </div>
          {msg.from === loggedInUserId && (
            <div className="message-time">
              {new Date(msg.time_stamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>
      );
    });

    // Add the messages end ref div once, outside of the loop
    messageElements.push(<div key="messages-end-ref" ref={messagesEndRef} />);

    return <>{messageElements}</>;
  };

  return (
    <div className="main-chat-container">
      <ContactList className="contact-list" />

      <div className="chat-container">
        <br />
        <h1 className="receiver-username">
          {receiverUserName ? receiverUserName : "Loading..."}
        </h1>
        <div className="messages-container">
          <hr />
          {renderMessages()}
          <div className="input-container">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress} // Add this line
              className="message-input"
            />
            <button onClick={handleSendMessage} className="send-button">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivateChat;
