const prompt = require('prompt-sync')();
const Bid = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Bid.js');
const toolFunctions = require('/home/tapsi/IdeaProjects/concurency/Client/Business/ToolFunctions.js');
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');


async function loadAddBidMenu() {
    let addBidRequirements = await prepareAddBidRequirements();
    if (!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(addBidRequirements.token))) {
        let bid = await Bid.createBidObject(addBidRequirements.biddingUsername, addBidRequirements.projectTitle, addBidRequirements.bidAmount);
        let {message, isBidValid} = await bid.checkIfBidIsValid();

        if (isBidValid === true) {
            let addBidMessage = await Bid.createBid(bid);
            return addBidMessage
        } else {
            return message;
        }
        ;

    }
}

async function prepareAddBidRequirements() {
    console.log(Messages.WelcomeToAddBidMenu);
    let inputArr = prompt("").split(" ");
    let biddingUsername = inputArr[1];
    let projectTitle = inputArr[2];
    let bidAmount = parseInt(inputArr[3]);
    let token = inputArr[4];

    return {
        biddingUsername: biddingUsername,
        projectTitle: projectTitle,
        bidAmount: bidAmount,
        token: token
    }

}

module.exports = {
    loadAddBidMenu
}
