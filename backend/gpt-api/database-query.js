const { createClient } = require('@supabase/supabase-js');

//Requires
require('dotenv').config();

//Database Constants
const supabaseUrl = 'https://iijnzlujdpmeotainyxm.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function getCouncillors() {
    try {
        // Query the Supabase database for councillors
        const { data, error } = await supabase
            .from('peer_helpers')
            .select('id, username, description');

        if (error) {
            console.error('Error retrieving peer helpers:', error.message);
            return []; // Return an empty array if there's an error
        } else {
            // Extract usernames and biographies from the data
            const peer_helpers = data.map(peer_helper => ({
                id: peer_helper.id,
                username: peer_helper.username,
                biography: peer_helper.description
            }));
            return peer_helpers;
        }
    } catch (error) {
        console.error('Error retrieving peer helpers:', error.message);
        return []; // Return an empty array if there's an error
    }
}

// Call the getCouncillors function and log the result
getCouncillors()
    .then(councillors => console.log('Helpers:', councillors))
    .catch(error => console.error('Error:', error));
