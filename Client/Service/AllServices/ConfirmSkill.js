const prompt = require('prompt-sync')();
const SkillConfirmation = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/SKillConfirmation.js');
const toolFunctions = require('/home/tapsi/IdeaProjects/concurency/Client/Business/ToolFunctions.js');
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');



async function loadConfirmSkillMenu() {
    let skillConfirmationRequirements = await prepareConfirmingSkillRequirements();

    if (!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(skillConfirmationRequirements.token))) {
        let hasConfirmedBefore = await SkillConfirmation.checkIfConfirmedBefore(skillConfirmationRequirements.conformerAccountUsername,
            skillConfirmationRequirements.targetAccountUsername, skillConfirmationRequirements.skillName);
        if (!hasConfirmedBefore) {
            let confirmationMessage =
                await SkillConfirmation.confirmSkill(skillConfirmationRequirements.conformerAccountUsername,
                    skillConfirmationRequirements.targetAccountUsername, skillConfirmationRequirements.skillName)
            return confirmationMessage;

        } else return (Messages.SkillHasBeenConfirmedBeforeError);

    }

}

async function prepareConfirmingSkillRequirements() {
    console.log(Messages.WelcomeToConfirmSkillMenu);
    const inputArr = prompt("").split(" ");
    let conformerAccountUsername = inputArr[1];
    let targetAccountUsername = inputArr[2];
    let skillName = inputArr[3];
    let token = inputArr[4];

    return {
        conformerAccountUsername: conformerAccountUsername,
        targetAccountUsername: targetAccountUsername,
        skillName: skillName,
        token: token

    }
}


module.exports = {
    loadConfirmSkillMenu
}

