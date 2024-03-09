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
const bcrypt = require('bcrypt');
const cors = require('cors')

//Database Constants
const supabaseUrl = 'https://iijnzlujdpmeotainyxm.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Store connected clients
const clients = new Map();
// Store messages
const messages = [];
// Track online users
const onlineUsers = new Set();

// Use body-parser middleware to parse incoming JSON payloads
app.use(bodyParser.json());

// Use CORS middleware
app.use(cors());

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

// Endpoint for user sign-up
app.post('/signup', async function(req, res) {
    const { username, password, email } = req.body;

    try {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the username, hashed password, and email into the Supabase database
        const { data, error } = await supabase.from('user').insert([{ username, password: hashedPassword, email }]);
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

// Endpoint for user sign-up
app.post('/peersignup', async function(req, res) {

    const { username, password, email, description, status} = req.body;

    try {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the username, hashed password, and email into the Supabase database
        const { data, error } = await supabase.from('peer_helpers').insert([{ username, password: hashedPassword, email, description, status}]);
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

// Endpoint for user login
app.post('/login', async function(req, res) {
    const { email, password } = req.body;

    try {
        // Query the Supabase database for the user with the provided email
        const { data, error } = await supabase
            .from('user')
            .select('*')
            .eq('email', email)
            .single();

        // Check if the user exists and the password matches
        if (error) {
            console.error('Error logging in:', error.message);
            res.status(500).json({ error: 'An error occurred while logging in' });
        } else if (!data) {
            // User not found
            res.status(401).json({ error: 'Invalid credentials' });
        } else {
            // Compare the provided password with the hashed password stored in the database
            const passwordMatch = await bcrypt.compare(password, data.password);
            if (passwordMatch) {
                // Passwords match, user is authenticated
                res.status(200).json({ message: 'Login successful', role: data.role });

            } else {
                // Passwords do not match
                res.status(401).json({ error: 'Invalid credentials' });
            }
        }
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({ error: 'An error occurred while logging in' });
    }
});

// Endpoint for peer login
app.post('/peerlogin', async function(req, res) {
    const { email, password } = req.body;

    try {
        // Query the Supabase database for the user with the provided email
        const { data, error } = await supabase
            .from('peer_helpers')
            .select('*')
            .eq('email', email)
            .single();

        // Check if the user exists and the password matches
        if (error) {
            console.error('Error logging in:', error.message);
            res.status(500).json({ error: 'An error occurred while logging in' });
        } else if (!data) {
            // User not found
            res.status(401).json({ error: 'Invalid credentials' });
        } else {
            // Compare the provided password with the hashed password stored in the database
            const passwordMatch = await bcrypt.compare(password, data.password);
            if (passwordMatch) {
                // Passwords match, user is authenticated
                res.status(200).json({ message: 'Login successful', role: data.role });

            } else {
                // Passwords do not match
                res.status(401).json({ error: 'Invalid credentials' });
            }
        }
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({ error: 'An error occurred while logging in' });
    }
});

app.get('/peer_helpers/inreview', async function(req, res) {
    try {
        // Query the Supabase database for peer_helpers with status "IN REVIEW"
        const { data, error } = await supabase
            .from('peer_helpers')
            .select('*')
            .eq('status', 'IN REVIEW');

        if (error) {
            console.error('Error retrieving peer_helpers:', error.message);
            res.status(500).json({ error: 'An error occurred while retrieving peer_helpers' });
        } else {
            // Remove password field from each object in the array
            const filteredData = data.map(item => {
                const { password, ...rest } = item;
                return rest;
            });

            console.log('Peer_helpers retrieved successfully:', filteredData);
            res.status(200).json(filteredData);
        }
    } catch (error) {
        console.error('Error retrieving peer_helpers:', error.message);
        res.status(500).json({ error: 'An error occurred while retrieving peer_helpers' });
    }
});


// Endpoint to change the status of a peer_helper
app.post('/peer_helpers/update_status', async function(req, res) {
    const { id, status } = req.body; // Now expecting both id and status

    if (!['ACTIVE', 'DENY', 'IN REVIEW'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const { error } = await supabase
            .from('peer_helpers')
            .update({ status })
            .eq('id', id);

        if (error) {
            console.error('Error updating peer_helper status:', error.message);
            res.status(500).json({ error: 'An error occurred while updating peer_helper status' });
        } else {
            console.log('Peer_helper status updated successfully');
            res.status(200).json({ message: 'Peer_helper status updated successfully' });
        }
    } catch (error) {
        console.error('Error updating peer_helper status:', error.message);
        res.status(500).json({ error: 'An error occurred while updating peer_helper status' });
    }
});

// Endpoint to add information into the help_request database table
app.post('/help_request', async function(req, res) {
    try {
        const { user_id, description } = req.body; // Assuming user_id and description are sent from the frontend

        // Insert the user_id and description into the help_request table
        const { data, error } = await supabase.from('help_request').insert([{ user_id, description }]);

        if (error) {
            console.error('Error adding help request:', error.message);
            res.status(500).json({ error: 'An error occurred while adding help request' });
        } else {
            console.log('Help request added successfully:', data);
            res.status(200).json({ message: 'Help request added successfully' });
        }
    } catch (error) {
        console.error('Error adding help request:', error.message);
        res.status(500).json({ error: 'An error occurred while adding help request' });
    }
});

// Endpoint for councillor login
app.post('/CouncilorLogin', async function(req, res) {
    const { email, password } = req.body;

    try {
        // Query the Supabase database for the user with the provided email
        const { data, error } = await supabase
            .from('councillors')
            .select('*')
            .eq('email', email)
            .single();

        // Check if the user exists and the password matches
        if (error) {
            console.error('Error logging in:', error.message);
            res.status(500).json({ error: 'An error occurred while logging in' });
        } else if (!data) {
            // User not found
            res.status(401).json({ error: 'Invalid credentials' });
        } else {
            // Compare the provided password with the password stored in the database
            if (password === data.password) {
                // Passwords match, user is authenticated
                res.status(200).json({ message: 'Login successful', role: data.role });
            } else {
                // Passwords do not match
                res.status(401).json({ error: 'Invalid credentials' });
            }
        }
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({ error: 'An error occurred while logging in' });
    }
});




server.listen(8000, function listening() {
    console.log('Server started on port 8000');
});