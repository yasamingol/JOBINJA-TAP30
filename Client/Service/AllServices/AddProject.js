const prompt = require('prompt-sync')();
const Project = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Project.js');
const toolFunctions = require('/home/tapsi/IdeaProjects/concurency/Client/Business/ToolFunctions.js');
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');
const Skill = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Skill.js');

async function loadAddProjectMenu() {

    let addProjectRequirements = await prepareAddProjectRequirements();

    let {skillsMap, messagesOfBuildSkillMap} = Skill.buildSkillsMap(addProjectRequirements.skillsArr);
    let project = new Project(addProjectRequirements.title, skillsMap, addProjectRequirements.budget,
        addProjectRequirements.deadline, addProjectRequirements.isAvailable);

    if (!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(addProjectRequirements.token))) {
        let addProjectMessage = await project.addProject();
        return {
            addProjectMessage: addProjectMessage,
            messagesOfBuildSkillMap: messagesOfBuildSkillMap
        }
    }

}


async function prepareAddProjectRequirements() {
    console.log(Messages.WelcomeToAddProjectMenu);
    let inputArr = prompt("").split(" ");
    let title = inputArr[1];
    let budget = inputArr[inputArr.length - 3];
    let deadLine = toolFunctions.stringToDateConverter(inputArr[inputArr.length - 2]);
    let skillsArr = inputArr.slice(2, inputArr.length - 3);
    let token = inputArr[inputArr.length - 1]

    return {
        title: title,
        budget: budget,
        deadLine: deadLine,
        skillsArr: skillsArr,
        isAvailable: true,
        token: token

    }
}

module.exports = {
    loadAddProjectMenu
}

