//imports
const { createClient } = require('@supabase/supabase-js');

//Requires
require('dotenv').config();

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors')

const { getActivePeerHelpers } = require('./gpt-api/database-query');
const { getRecommendations } = require('./gpt-api/create-prompt');

//Database Constants
const supabaseUrl = 'https://iijnzlujdpmeotainyxm.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const clients = {};

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const messageObject = JSON.parse(message);

        if (messageObject.type === 'join') {
            // Save the user's WebSocket connection
            clients[messageObject.userId] = ws;
        } else if (messageObject.type === 'message') {
            // Send the message to the specific other user
            const targetUserId = messageObject.chatId.replace(messageObject.from, '').replace('-', '');
            if (clients[targetUserId] && clients[targetUserId].readyState === WebSocket.OPEN) {
                clients[targetUserId].send(JSON.stringify(messageObject));
            }
        }
    });

    ws.on('close', () => {
        // Remove the WebSocket connection when the user disconnects
        Object.entries(clients).forEach(([userId, clientWs]) => {
            if (clientWs === ws) {
                delete clients[userId];
            }
        });
    });
});

// Use body-parser middleware to parse incoming JSON payloads
app.use(bodyParser.json());

// Use CORS middleware
app.use(cors());

// If index.html is located in the chat directory
app.get('/', function (req, res) {
    console.log('Serving index.html');
});

// Error handling middleware
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// Endpoint for user sign-up
app.post('/signup', async function (req, res) {
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
            console.log('User signed up successfully:', username);
            res.status(200).json({ message: 'User signed up successfully' });
        }
    } catch (error) {
        console.error('Error signing up:', error.message);
        res.status(500).json({ error: 'An error occurred while signing up' });
    }
});

// Endpoint for user sign-up
app.post('/peersignup', async function (req, res) {

    const { username, password, email, description, status } = req.body;

    try {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the username, hashed password, and email into the Supabase database
        const { data, error } = await supabase.from('peer_helpers').insert([{ username, password: hashedPassword, email, description, status }]);
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
app.post('/login', async function (req, res) {
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
                const username = data.id;

                // Passwords match, user is authenticated
                res.status(200).json({ message: 'Login successful', userID: username });
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

app.get("/getAllUsers", async function (req, res) {
    try {
        const { data, error } = await supabase.from('user').select('*');
        if (error) {
            console.error('Error getting users:', error.message);
            res.status(500).json({ error: 'An error occurred while getting users' });
        } else {
            res.status(200).json(data);
        }
    } catch (error) {
        console.error('Error getting users:', error.message);
        res.status(500).json({ error: 'An error occurred while getting users' });
    }
})

app.get("/getAllPeerHelpers", async function (req, res) {
    try {
        const { data, error } = await supabase.from('peer_helpers').select('*');
        if (error) {
            console.error('Error getting peer:', error.message);
            res.status(500).json({ error: 'An error occurred while getting users' });
        } else {
            res.status(200).json(data);
        }
    } catch (error) {
        console.error('Error getting peer:', error.message);
        res.status(500).json({ error: 'An error occurred while getting users' });
    }
})

// Endpoint for user login
app.post('/peerlogin', async function (req, res) {
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
                const username = data.id;

                // Passwords match, user is authenticated
                res.status(200).json({ message: 'Login successful', userID: username });
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
app.post('/help_request', async function (req, res) {
    try {
        const { user_id, description } = req.body; // Assuming user_id and description are sent from the frontend

        // Insert the user_id and description into the help_request table
        const { data: helpRequestData, error: helpRequestError } = await supabase.from('help_request').insert([{ user_id, description }]);

        if (helpRequestError) {
            console.error('Error adding help request:', helpRequestError.message);
            res.status(500).json({ error: 'An error occurred while adding help request' });
            return; // Stop execution if there's an error
        }

        // Query active peer helpers from the database
        const { data: peerHelpers, error: peerHelpersError } = await getActivePeerHelpers();

        console.log('Peer helpers data:', peerHelpers);
        console.log('Peer helpers error:', peerHelpersError);

        if (peerHelpersError) {
            console.error('Error retrieving active peer helpers:', peerHelpersError.message);
            res.status(500).json({ error: 'An error occurred while retrieving active peer helpers' });
            return; // Stop execution if there's an error
        }

        // Extract descriptions and IDs of active peer helpers
        const peerHelperDescriptions = peerHelpers.map(peerHelper => peerHelper.description);
        const peerHelperIDs = peerHelpers.map(peerHelper => peerHelper.id); // Assuming peer helper IDs are available in the data
        const peerHelperNames = peerHelpers.map(peerHelper => peerHelper.username)

        // Call GPT to get recommendations based on user's description and peer helpers' descriptions
        const recommendations = await getRecommendations(description, peerHelperDescriptions, peerHelperIDs, peerHelperNames);

        // Return the recommendations to the front end
        res.status(200).json({ recommendations });
    } catch (error) {
        console.error('Error adding help request:', error.message);
        res.status(500).json({ error: 'An error occurred while adding help request' });
    }
});

// Endpoint for councillor login
app.post('/CouncilorLogin', async function (req, res) {
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
                res.status(200).json({ message: 'Login successful' });
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
