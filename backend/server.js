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


const { getActivePeerHelpers } = require('./gpt-api/database-query');
const { getRecommendations } = require('./gpt-api/create-prompt');

//Database Constants
const supabaseUrl = 'https://iijnzlujdpmeotainyxm.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Store connected clients
const clients = new Map();

// Use body-parser middleware to parse incoming JSON payloads
app.use(bodyParser.json());

// Use CORS middleware
app.use(cors());

// const clients = {};

wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
        const messageObject = JSON.parse(message);

        if (messageObject.type === 'join') {
            clients[messageObject.userId] = ws;
        } else if (messageObject.type === 'message') {
            const targetUserId = messageObject.chatId.replace(messageObject.from, '').replace('-', '');

            // Determine user types asynchronously
            const senderType = await determineUserType(messageObject.from);
            const recipientType = await determineUserType(targetUserId);

            // Broadcast the message to the recipient if they are connected
            if (clients[targetUserId] && clients[targetUserId].readyState === WebSocket.OPEN) {
                clients[targetUserId].send(JSON.stringify({
                    ...messageObject,
                    message_text: messageObject.content, // Include message text
                    sender_type: senderType,
                    recipient_type: recipientType,
                    time_stamp: new Date().toISOString()
                }));

            }

            // Save message to the database
            try {
                const { data, error } = await supabase
                    .from('messages')
                    .insert([{
                        message_text: messageObject.content,
                        sender_id: messageObject.from,
                        sender_type: senderType,
                        recipient_id: targetUserId,
                        recipient_type: recipientType,
                        time_stamp: new Date().toISOString()
                    }]);

                if (error) {
                    throw new Error(error.message);
                }
            } catch (error) {
                console.error('Error saving message to the database:', error);
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

// Implement this function based on your application's logic
async function determineUserType(userId) {
    const { data, error } = await supabase.from('user').select('*').eq('id', userId);

    if (error) {
        console.error('Error determining user type:', error.message);
        // Consider what you want to do in case of an error. You could throw an error, return 'unknown', etc.
        return 'unknown'; // This is just an example. Handle as appropriate for your app.
    }

    // Check if the database has returned any data
    if (data && data.length > 0) {
        // If the array is not empty, it means the user was found in the 'user' table
        return 'user';
    } else {
        // If the array is empty, it means the user was not found in the 'user' table
        return 'peer_helper';
    }
}

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
app.post('/signup', async function (req, res) {
    const { username, password, email, role } = req.body;

    try {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the username, hashed password, and email into the Supabase database
        const { data, error } = await supabase.from('user').insert([{ username, password: hashedPassword, email, role }]);
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

app.get("/getAllUsers", async function (req, res) {
    try {
        const { data, error } = await supabase.from('user').select('*');
        if (error) {
            console.error('Error getting users:', error.message);
            res.status(500).json({ error: 'An error occurred while getting users' });
        } else {
            console.log(data);
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
            console.log(data);
            res.status(200).json(data);
        }
    } catch (error) {
        console.error('Error getting peer:', error.message);
        res.status(500).json({ error: 'An error occurred while getting users' });
    }
})

app.get("/getAllCouncilors", async function (req, res) {
    try {
        const { data, error } = await supabase.from('councillors').select('*');
        if (error) {
            console.error('Error getting councillors:', error.message);
            res.status(500).json({ error: 'An error occurred while getting councillors' });
        } else {
            console.log(data);
            res.status(200).json(data);
        }
    } catch (error) {
        console.error('Error getting councillors:', error.message);
        res.status(500).json({ error: 'An error occurred while getting councillors' });
    }
});

// Endpoint for user sign-up
app.post('/peersignup', async function (req, res) {

    const { username, password, email, description, status, role } = req.body;

    try {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the username, hashed password, and email into the Supabase database
        const { data, error } = await supabase.from('peer_helpers').insert([{ username, password: hashedPassword, email, description, status, role }]);
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
                // Passwords match, user is authenticated
                const userId = data.id;
                const role = data.role;
                const name = data.username;
                res.status(200).json({ message: 'Login successful', userID: userId , role: role, username: name });

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
app.post('/peerlogin', async function (req, res) {
    const { email, password } = req.body;

    try {
        // Query the Supabase database for the user with the provided email
        const { data, error } = await supabase
            .from('peer_helpers')
            .select('*')
            .eq('email', email)
            .eq('status', 'ACTIVE') // Add condition to check for "ACTIVE" status
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
                console.log(data);
                const username = data.id;
                const role = data.role;

                // Passwords match, user is authenticated
                res.status(200).json({ message: 'Login successful', userID: username, role: role });
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


app.get('/peer_helpers/inreview', async function (req, res) {
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
app.post('/peer_helpers/update_status', async function (req, res) {
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
                const username = data.id;
                const role = data.role;
                res.status(200).json({ message: 'Login successful', userID: username, role: role });

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

app.get('/getUserNameById/:id', async (req, res) => {
    const { id } = req.params;

    try {
        let { data: userData, error: userError } = await supabase
            .from('user')
            .select('username')
            .eq('id', id);

        if (userError) {
            throw userError;
        }

        if (userData && userData.length === 1) {
            res.status(200).send({ username: userData[0].username });
            return;
        }

        let { data: helperData, error: helperError } = await supabase
            .from('peer_helpers')
            .select('username')
            .eq('id', id);

        if (helperError) {
            throw helperError;
        }

        if (helperData && helperData.length === 1) {
            res.status(200).send({ username: helperData[0].username });
            return;
        }

        res.status(404).send('User not found');
    } catch (error) {
        console.error('Error fetching username:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/getChatHistory/:senderId/:recipientId', async (req, res) => {
    const { senderId, recipientId } = req.params;

    try {
        // Query to get messages from the database where the current user is either the sender or recipient
        let { data, error } = await supabase
            .from('messages')
            .select('*')
            .or(`sender_id.eq.${senderId},recipient_id.eq.${senderId}`)
            .or(`sender_id.eq.${recipientId},recipient_id.eq.${recipientId}`)
            .order('time_stamp', { ascending: true }); // Sort by time_stamp to get the messages in order

        if (error) {
            throw error;
        }

        // Filter messages that are between senderId and recipientId
        const chatHistory = data.filter(message => {
            return (message.sender_id === senderId && message.recipient_id === recipientId) ||
                (message.sender_id === recipientId && message.recipient_id === senderId);
        });

        res.json(chatHistory);
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/connectUserWithPeer', async (req, res) => {
    const { userId, peerId } = req.body;

    console.log('Connecting user with peer:', userId, peerId);

    try {
        const { data, error } = await supabase
            .from('user_to_peer')
            .insert([{ user_id: userId, peer_id: peerId }]);

        if (error) {
            console.error('Database error:', error);
            throw error;
        }

        res.status(200).send('Connected user with peer');
    } catch (error) {
        console.error('Error connecting user with peer:', error);
        res.status(500).send('Error details: ' + error.message);
    }
});

app.get('/getUsersConnectedWithPeers/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const { data, error } = await supabase
            .from('user_to_peer')
            .select(`
                peer_helpers (
                    id,
                    username,
                    email,
                    description,
                    status,
                    role
                )
            `)
            .eq('user_id', userId);

        if (error) {
            console.error('Database error:', error);
            throw error;
        }

        // Extracting peer_helpers data from each row
        const peerHelpersData = data.map(item => item.peer_helpers);

        res.status(200).json(peerHelpersData);
    } catch (error) {
        console.error('Error fetching users connected with peers:', error);
        res.status(500).send('Error details: ' + error.message);
    }
});

app.get('/getPeersConnectedWithUsers/:userId', async (req, res) => {
    const { userId } = req.params;

    console.log('Fetching peers connected with user:', userId);

    try {
        const { data, error } = await supabase
            .from('user_to_peer')
            .select(`
                user (
                    id,
                    username,
                    email,
                    description,
                    role
                )
            `)
            .eq('peer_id', userId);

        if (error) {
            console.error('Database error:', error);
            throw error;
        }

        // Extracting user data from each row
        const userData = data.map(item => item.user);

        res.status(200).json(userData);
    } catch (error) {
        console.error('Error fetching users connected with peers:', error);
        res.status(500).send('Error details: ' + error.message);
    }
});


server.listen(8000, function listening() {
    console.log('Server started on port 8000');
});