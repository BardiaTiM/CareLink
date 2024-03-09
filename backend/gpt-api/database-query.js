const { createClient } = require('@supabase/supabase-js');

//Requires
require('dotenv').config();

//Database Constants
const supabaseUrl = 'https://iijnzlujdpmeotainyxm.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Function that queries through the Councillor table and returns them for use by format-query.js
 * @returns an array of javascript objects that have each Councillor and their name and bio
 */
async function getCouncillors() {
    try {
        // Query the Supabase database for councillors
        const { data, error } = await supabase
            .from('councillors')
            .select('username, biography');

        if (error) {
            console.error('Error retrieving councillors:', error.message);
            return []; // Return an empty array if there's an error
        } else {
            // Extract usernames and biographies from the data
            const councillors = data.map(councillor => ({
                username: councillor.username,
                biography: councillor.biography
            }));
            return councillors;
        }
    } catch (error) {
        console.error('Error retrieving councillors:', error.message);
        return []; // Return an empty array if there's an error
    }
}

// Call the getCouncillors function and log the result
getCouncillors()
    .then(councillors => console.log('Councillors:', councillors))
    .catch(error => console.error('Error:', error));

// exporting method to use in other functions
module.exports = getCouncillors;
