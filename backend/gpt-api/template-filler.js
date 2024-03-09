/**
 * Fills template that is used by create-prompt.js
 * Template is filled with:
 * 1. student's problem they have given 
 * 2. meta schema of all counselor information that gpt will use to match the problem with
 * the appropriate counselors
 * @param {*} template chosen to be completed by studentProblem and metaSchema
 * @param {*} studentProblem from user input
 * @param {*} metaSchema of information about counsellors retrieved from supabase server
 * @returns filled out template using given strings
 */
function generateCounselorTemplate(template, studentProblem, metaSchema) {
    // Create a new function that returns the template literal with placeholders replaced
    // by the actual values of studentProblem and metaSchema variables.
    // The new Function constructor is used to dynamically evaluate the template string.
    const renderTemplate = new Function('studentProblem', 'metaSchema', `return \`${template}\`;`);

    // Execute the dynamically created function with studentProblem and metaSchema as arguments
    return renderTemplate(studentProblem, metaSchema);
}

module.exports = generateCounselorTemplate;

/* Example usage
const templateString = `
Input:

A student has described a problem that they are dealing with and they are requesting counselling and guidance. Based on the problem description and the meta schema of the counselors best skills pick and rank the top 4 counselors that are able to help.

Student Problem: \${studentProblem}

Meta-schema: \${metaSchema}

Output in JSON format:
1. Counselor name: 
1. Counselor description:
2. Counselor name: 
2. Counselor description:
3. Counselor name: 
3. Counselor description:
4. Counselor name: 
4. Counselor description:
`;

const studentProblem = "Feeling overwhelmed with school work and personal life.";
const metaSchema = "Counselors specializing in academic stress and personal life balance.";

const filledTemplate = generateCounselorTemplate(templateString, studentProblem, metaSchema);
console.log(filledTemplate);
*/

// Look back to refactor to implement practices that prevent code injection