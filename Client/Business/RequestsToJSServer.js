const viewClass = require("../View/Menus.js");
const util = require('util');

async function getAllSkillsFromServer(request) {
    const promisifiedRequest = util.promisify(request);
    const {error, response, body} = await promisifiedRequest('http://localhost:5000/api/skills');
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    deserializeAllSkills(body);

}

function deserializeAllSkills(body) {
    viewClass.allSkills = JSON.parse(body);
}


module.exports = {
    getAllSkillsFromServer,
    deserializeAllSkills

}