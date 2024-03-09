const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = {};

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        const data = JSON.parse(message);
        if (data.type === 'join') {
            clients[data.username] = ws;
        } else if (data.type === 'message') {
            if (clients[data.to]) {
                clients[data.to].send(JSON.stringify({ type: 'message', from: data.from, message: data.message }));
            }
        }
    });
});

// Serve static files from the chat directory
app.use(express.static(path.join(__dirname, 'chat')));

// If index.html is located in the chat directory
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'chat', 'index.html'));
});

server.listen(3000, function listening() {
    console.log('Server started on port 3000');
});
