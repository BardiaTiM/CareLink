const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Map();
// Store messages
const messages = [];
// Track online users
const onlineUsers = new Set();

wss.on('connection', function connection(ws) {
    let username = null;

    ws.on('message', function incoming(message) {
        try {
            const data = JSON.parse(message);
            if (data.type === 'join') {
                username = data.username;
                clients.set(username, ws);
                onlineUsers.add(username);
            } else if (data.type === 'message') {
                const from = data.from;
                const to = data.to;
                const messageContent = data.message;

                // Store message
                messages.push({ from, to, message: messageContent });

                // Send message to recipient if connected
                if (to && clients.has(to)) {
                    clients.get(to).send(JSON.stringify({ type: 'message', from, message: messageContent }));
                } else if (!to) { // Broadcast to all users
                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({ type: 'message', from, message: messageContent }));
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    // Send stored messages to the user
    ws.on('open', function () {
        if (username) {
            const userMessages = messages.filter(msg => msg.to === username);
            userMessages.forEach(msg => {
                ws.send(JSON.stringify({ type: 'message', from: msg.from, message: msg.message }));
            });
        }
    });

    ws.on('close', function () {
        if (username) {
            onlineUsers.delete(username);
        }
    });
});

// Serve static files from the chat directory
app.use(express.static(path.join(__dirname, 'chat')));

// If index.html is located in the chat directory
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'chat', 'index.html'));
});

// Error handling middleware
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

server.listen(3000, function listening() {
    console.log('Server started on port 3000');
});
