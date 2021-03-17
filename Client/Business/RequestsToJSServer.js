const Skill = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Skill.js')
const util = require('util');

async function getAllSkillsFromServer(request) {
    const promisifiedRequest = util.promisify(request);
    const {error, response, body} = await promisifiedRequest('http://localhost:5000/api/skills');
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    Skill.allSkills = deserializeAllSkills(body);

}

function deserializeAllSkills(body) {
    let allSkills = JSON.parse(body);
    return allSkills;
}


module.exports = {
    getAllSkillsFromServer,
    deserializeAllSkills

}