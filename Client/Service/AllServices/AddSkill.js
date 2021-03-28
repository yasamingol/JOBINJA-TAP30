const prompt = require('prompt-sync')();
const Skill = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Skill.js');
const toolFunctions = require('/home/tapsi/IdeaProjects/concurency/Client/Business/ToolFunctions.js');
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');


let arrSkills;
async function loadAddSkillMenu() {
    let addSkillRequirements = await prepareAddSkillRequirements();
    if (!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(addSkillRequirements.token))) {
        let newSkill = await prepareNewSkill();

        if (Skill.checkIfSkillIsValid(newSkill.skillName)) {
            let addSkillMessage = await Skill.addSkill(addSkillRequirements.username, newSkill.skillName, parseInt(newSkill.skillPoint))
            return addSkillMessage;

        } else {
            return (Messages.SkillDoesNotExistError);
        }
    }
}


async function prepareAddSkillRequirements() {
    console.log(Messages.WelcomeToAddSkillMenu);
    const inputArr = prompt("").split(" ");
    let username = inputArr[1];
    let token = inputArr[3];
    arrSkills = inputArr[2].split(":");

    return {
        username: username,
        token: token
    }

}

async function prepareNewSkill() {
    let skillName = arrSkills[0];
    let skillPoint = arrSkills[1];

    return {
        skillName: skillName,
        skillPoint: skillPoint
    }
}

module.exports = {
    loadAddSkillMenu
}