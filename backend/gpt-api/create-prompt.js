//Initializing GPT API

import OpenAI from "openai"
require('dotenv').config();
// Load your key from an environment variable or secret management service
// (do not include your key directly in your code)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
});

/**
 * Function that uses gpt-api
 * @param {*} filledTemplate 
 * @returns 
 */
async function useGptApi(filledTemplate) {
  try {
        const completion = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        prompt: filledTemplate,
        max_tokens: 150,
    });

    console.log(completion.choices[0].message.content);
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching the completion:", error);
    throw error; // Rethrow the error to handle it outside
  }
}


/* 
    const template = `
    A student has described a problem that they are dealing with and they are requesting counselling and guidance. Based on the problem description and the meta schema of the councilors best skills pick and rank the top 4 councilors that are able to help.

    Student Problem: [Insert student problem here]

    Meta-schema: [Insert meta-schema here]
    `;

    const studentProblem = "Feeling overwhelmed with school work and personal life.";
    const metaSchema = "Counselors specializing in academic stress and personal life balance.";

    // Fill the template
    const filledTemplate = fillTemplate(template, studentProblem, metaSchema);
    
    // Use the filled template as the prompt for the GPT API function
    await getGptResponse(filledTemplate);
*/