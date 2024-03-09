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

//Database Constants
const supabaseUrl = 'https://iijnzlujdpmeotainyxm.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
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


server.listen(8000, function listening() {
    console.log('Server started on port 8000');
});
