const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Map();

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        try {
            const data = JSON.parse(message);
            if (data.type === 'join') {
                clients.set(data.username, ws);
            } else if (data.type === 'message') {
                const recipientSocket = clients.get(data.to);
                if (recipientSocket) {
                    recipientSocket.send(JSON.stringify({ type: 'message', from: data.from, message: data.message }));
                } else {
                    console.log(`Recipient ${data.to} not found.`);
                }
            }
        } catch (error) {
            console.error('Error parsing message:', error);
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
