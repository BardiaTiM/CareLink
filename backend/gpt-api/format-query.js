/**
 * Grabs an array of js objects from format-query.js 
 * formats it into string format that is used by template-filler.js 
 * @param {*} councillors array of objects that have a name and biography from Counselor database table
 * @returns string format of the array 
 */
function formatCouncillorsData(councillors) {
    return councillors.map((councillor, index) => 
        `${index + 1}. Counselor name: ${councillor.username}\n` + 
        `   Counselor description: ${councillor.biography}`
    ).join('\n');
}
module.exports = formatCouncillorsData;