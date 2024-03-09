//imports
const { createClient } = require('@supabase/supabase-js');

//Requires
require('dotenv').config();

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const bodyParser = require('body-parser');

//Database Constants
const supabaseUrl = 'https://iijnzlujdpmeotainyxm.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Store connected clients
const clients = new Map();

// Use body-parser middleware to parse incoming JSON payloads
app.use(bodyParser.json());

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

// Endpoint for user sign-up
app.post('/signup', async function(req, res) {
    const { username, password, email } = req.body;

    console.log("USERNAME" + username);

    // Insert the username and password into the Supabase database
    try {
        const { data, error } = await supabase.from('user').insert([{ username, password, email }]);
        if (error) {
            console.error('Error signing up:', error.message);
            res.status(500).json({ error: 'An error occurred while signing up' });
        } else {
            console.log('User signed up successfully:', data);
            res.status(200).json({ message: 'User signed up successfully' });
        }
    } catch (error) {
        console.error('Error signing up:', error.message);
        res.status(500).json({ error: 'An error occurred while signing up' });
    }
});

server.listen(3000, function listening() {
    console.log('Server started on port 3000');
});
