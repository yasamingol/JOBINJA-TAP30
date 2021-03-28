const prompt = require('prompt-sync')();
const Account = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Account.js');
const toolFunctions = require('/home/tapsi/IdeaProjects/concurency/Client/Business/ToolFunctions.js');
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');


async function loadViewAvailableProjectsMenu() {
    let availableProjectsRequirements = await prepareAvailableProjectsRequirements();
    if (!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(availableProjectsRequirements.token))) {
        let availableProjectsArr = await Account.getAvailableProjectsForAccount(availableProjectsRequirements.username);
        availableProjectsArr.forEach((project) => {
            console.log(project);
        })
    }
}

async function prepareAvailableProjectsRequirements() {
    console.log(Messages.WelcomeToViewAvailableProjectsMenu);
    console.log("\n Available projects : ".green);

    let inputArr = prompt("").split(" ");
    let username = inputArr[0];
    let token = inputArr[1];
    return {
        username: username,
        token: token

    }
}


module.exports = {
    loadViewAvailableProjectsMenu,
}
