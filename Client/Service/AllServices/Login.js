const prompt = require('prompt-sync')();
const Account = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Account.js');
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');

async function loadLoginMenu() {
    let loginRequirements = await prepareLoginRequirements();
    let loginMessage = await Account.login(loginRequirements.username, loginRequirements.password);
    return loginMessage;
}


async function prepareLoginRequirements() {
    console.log(Messages.WelcomeToLoginMenu);
    let inputArr = prompt("").split(" ");
    let username = inputArr[1];
    let password = inputArr[2];
    return {
        username: username,
        password: password
    }

}

module.exports = {
    loadLoginMenu
}