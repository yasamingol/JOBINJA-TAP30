const prompt = require('prompt-sync')();
const Account = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Account.js');
const toolFunctions = require('/home/tapsi/IdeaProjects/concurency/Client/Business/ToolFunctions.js');
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');


async function loadGetAccountByIdMenu() {
    let getAccountByIdRequirements = await prepareGetAccountByIdRequirements();
    if (!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(getAccountByIdRequirements.token))) {
        console.log(await Account.getAccountById(getAccountByIdRequirements.accountId));
    }
}

async function prepareGetAccountByIdRequirements() {
    console.log(Messages.WelcomeToViewAccountMenu);
    let inputArr = prompt("").split(" ");
    let accountId = parseInt(inputArr[0]);
    let token = inputArr[1];

    return {
        accountId: accountId,
        token: token
    }
}

module.exports = {
    loadGetAccountByIdMenu
}
