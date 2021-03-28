const prompt = require('prompt-sync')();
const Account = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Account.js');
const toolFunctions = require('/home/tapsi/IdeaProjects/concurency/Client/Business/ToolFunctions.js');
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');


async function loadViewAllAccountsMenu() {
    console.log(Messages.ViewAllAccountsMenu);
    let token = prompt("");

    if (!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        let allAccountsArr = await Account.viewAllAccounts();
        allAccountsArr.forEach((account) => {
            console.log(account);
        })
    }
}

module.exports = {
    loadViewAllAccountsMenu
}
