const OpenAI = require("openai");
require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openaiClient = new OpenAI({
    apiKey: OPENAI_API_KEY
});
async function getRecommendations(userDescription, peerDescriptions, peerIDs, peerHelperNames) {
  try {

     // Validate peer data before sending to GPT
      if (!Array.isArray(peerDescriptions) || !Array.isArray(peerIDs) || peerDescriptions.length !== peerIDs.length) {
        throw new Error('Invalid peer data');
      }

      // Log peer data for debugging
      console.log('Peer Descriptions:', peerDescriptions);
      console.log('Peer IDs:', peerIDs);
      console.log("Peer Names: " + peerHelperNames);
      const completion = await openaiClient.chat.completions.create({
          messages: [
              { role: 'system', content: 'A student has described a problem that they are dealing with and they are requesting counselling and guidance. Based on the problem description and the peers description pick and rank the top 4 peers that are able to help. return their peerIDS and description in a format like this peerID: {id here}, description: {desc here}, username: {username here} make sure to only select from the peers I give you DO NOT MAKE ANY UP' },
              { role: 'user', content: "this is the issue the user has" + userDescription },
              { role: 'user', content: "THESE ARE THE PEER DESCRIPTIONS " + peerDescriptions },
              { role: 'user', content: "THESE ARE THE PEER IDS " + peerIDs},
              {role: 'user', content: "THESE ARE THE PEER NAMES " + peerHelperNames}
          ],
          model: 'gpt-4',
      });

      console.log('GPT Completion:', completion.choices[0].message.content);

      // Parse peerID, description, and username from GPT response
const recommendations = completion.choices[0].message.content
    .split('\n') // Split into individual lines
    .map(entry => {
        const match = entry.match(/peerID: (.*), description: (.*), username: (.*)/);
        if (match && match.length === 4) {
            const peerID = match[1].trim();
            const description = match[2].trim();
            const username = match[3].trim();
            return { peerID, description, username };
        } else {
            console.error('Invalid format in GPT response:', entry);
            return null; // Return null for invalid entries
        }
    })
    .filter(entry => entry !== null); // Filter out null entries




   return recommendations;
  } catch (error) {
      console.error('Error getting recommendations from GPT:', error.message);
      return []; // Return an empty array if there's an error
  }
}





module.exports.getRecommendations = getRecommendations;