const ws = new WebSocket("ws://localhost:3000");
let username = localStorage.getItem("selectedUser");
let recipient = "";

ws.onopen = function () {
    if (!username) {
        alert("Username not found. Please go back and select a user.");
        return;
    }
    ws.send(JSON.stringify({ type: "join", username: username }));
    displayCurrentUser();
};

ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    if (data.type === "message") {
        displayMessage(`${data.from}: ${data.message}`);
    }
};

function sendMessage() {
    const recipientInput = document.getElementById("recipient");
    recipient = recipientInput.value.trim();
    const messageInput = document.getElementById("message");
    const message = messageInput.value.trim();
    if (recipient !== "" && message !== "") {
        ws.send(
            JSON.stringify({
                type: "message",
                from: username,
                to: recipient,
                message: message,
            })
        );
        messageInput.value = "";
    } else {
        alert("Please enter a recipient username and a message.");
    }
}

function displayMessage(message) {
    const chatArea = document.getElementById("chat-area");
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    chatArea.appendChild(messageElement);
}

function displayCurrentUser() {
    const userStatus = document.getElementById("user-status");
    userStatus.textContent = `Logged in as: ${username}`;
}