const express = require('express');
const http = require('http');
const WebSocket = require('ws');

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

server.listen(8080, function listening() {
    console.log('Server started on port 8080');
});