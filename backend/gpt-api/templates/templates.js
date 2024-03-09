// This is where we will store templates used in gpt-api functions
const counselorRecommendationTemplate = `
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

module.exports = counselorRecommendationTemplate;