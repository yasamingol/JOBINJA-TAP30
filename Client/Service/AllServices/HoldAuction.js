const prompt = require('prompt-sync')();
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');
const Auction = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Auction.js');
const Project = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Project.js');
const toolFunctions = require('/home/tapsi/IdeaProjects/concurency/Client/Business/ToolFunctions.js');


async function loadHoldAuctionMenu() {
    let holdAuctionRequirements = await prepareAuctionRequirements();
    if (!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(holdAuctionRequirements.token))) {

        let projectIsAvailable = Project.checkIfProjectIsAvailable(holdAuctionRequirements.projectId)
        if (projectIsAvailable) {
            return await Auction.holdAuctionForProject(holdAuctionRequirements.projectId);
        } else {
            return Messages.ProjectIsNotAvailableError;
        }
    }

}


async function prepareAuctionRequirements() {
    console.log(Messages.WelcomeToAuctionMenu);
    let inputArr = prompt("").split(" ");
    let projectId = parseInt(inputArr[1]);
    let token = inputArr[2];

    return {
        projectId: projectId,
        token: token
    }
}

module.exports = {
    loadHoldAuctionMenu
}
