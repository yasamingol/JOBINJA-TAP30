const prompt = require('prompt-sync')();
const Project = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Project.js');
const toolFunctions = require('/home/tapsi/IdeaProjects/concurency/Client/Business/ToolFunctions.js');
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');



async function loadAllProjectsMenu() {
    console.log(Messages.ViewAllProjectsMenu);
    let token = prompt("");

    if (!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        let projectsArray = await Project.viewAllProjects();
        projectsArray.forEach((project) => {
            console.log(project);
        })
    }

}

module.exports = {
    loadAllProjectsMenu,
}