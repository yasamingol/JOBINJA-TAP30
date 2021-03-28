const prompt = require('prompt-sync')();
const Project = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Project.js');
const toolFunctions = require('/home/tapsi/IdeaProjects/concurency/Client/Business/ToolFunctions.js');
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');


async function loadGetProjectByIdMenu() {
    let getProjectByIdRequirements = await prepareGetProjectByIdRequirements();
    if (!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(getProjectByIdRequirements.token))) {
        console.log(await Project.getProjectById(getProjectByIdRequirements.projectId));
    }
}

async function prepareGetProjectByIdRequirements() {
    console.log(Messages.WelcomeToViewProjectMenu);
    let inputArr = prompt("").split(" ");
    let projectId = parseInt(inputArr[0]);
    let token = inputArr[1];

    return {
        projectId: projectId,
        token: token
    }
}

module.exports = {
    loadGetProjectByIdMenu
}
