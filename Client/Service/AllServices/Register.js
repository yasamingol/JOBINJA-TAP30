const prompt = require('prompt-sync')();
const Account = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Account.js');
const Skill = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Skill.js');
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');


async function loadRegisterMenu() {
    let registerRequirements = prepareRegistrationRequirements();
    let {skillsMap, message} = Skill.buildSkillsMap(registerRequirements.skillsArr);
    let account = new Account(registerRequirements.username, registerRequirements.password, skillsMap);
    let registerMessage = await account.register();

    return {
        buildSkillMessage: message,
        registerMessage: registerMessage
    }

}


function prepareRegistrationRequirements() {
    console.log(Messages.WelcomeToRegisterMenu);
    let inputArr = prompt("").split(" ");
    let username = inputArr[1];
    let password = inputArr[2];
    let skillsArr = inputArr.slice(3, inputArr.length);

    return {
        username: username,
        password: password,
        skillsArr: skillsArr
    }

}

module.exports = {
    loadRegisterMenu
}

