const prompt = require('prompt-sync')();
const Account = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Account.js');
const Skill = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Skill.js');
const toolFunctions = require('/home/tapsi/IdeaProjects/concurency/Client/Business/ToolFunctions.js');
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');


async function loadRemoveSkillMenu() {
    let removeSkillRequirements = await prepareRemoveSkillRequirements();
    if (!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(removeSkillRequirements.token))) {

        if (await Account.checkIfAccountHasSkill(removeSkillRequirements.username, removeSkillRequirements.skillName)) {
            let removeSkillMessage = await Skill.removeSkill(removeSkillRequirements.username, removeSkillRequirements.skillName)
            return removeSkillMessage;
        } else {
            return (Messages.UserDoesNotHaveSKillError);
        }
    }

}

async function prepareRemoveSkillRequirements() {
    console.log(Messages.WelcomeToRemoveSkillMenu);
    const inputArr = prompt("").split(" ");
    let username = inputArr[1];
    let skillName = inputArr[2];
    let token = inputArr[3];

    return {
        username: username,
        skillName: skillName,
        token: token
    }
}

module.exports = {
    loadRemoveSkillMenu
}
