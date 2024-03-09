const { createClient } = require('@supabase/supabase-js');

//Requires
require('dotenv').config();

//Database Constants
const supabaseUrl = 'https://iijnzlujdpmeotainyxm.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function getActivePeerHelpers() {
    try {
        // Query the Supabase database for active peer helpers
        const { data, error } = await supabase
            .from('peer_helpers')
            .select('id, description')
            .eq('status', 'ACTIVE');

        if (error) {
            console.error('Error retrieving active peer helpers:', error.message);
            return { error }; // Return the error object if there's an error
        } else {
            // Extract usernames and descriptions from the data
            const peerHelpers = data.map(peerHelper => ({
                id: peerHelper.id,
                description: peerHelper.description
            }));
            return { data: peerHelpers }; // Return the data object
        }
    } catch (error) {
        console.error('Error retrieving active peer helpers:', error.message);
        return { error }; // Return the error object
    }
}


module.exports.getActivePeerHelpers = getActivePeerHelpers;

