const menu = require('/home/tapsi/IdeaProjects/concurency/Client/Service/LoadMenus.js');
const requestToJSServer = require('/home/tapsi/IdeaProjects/concurency/Client/Business/RequestsToJSServer.js');
const request = require('request');
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');
const Project = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Project.js');
const Account = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Account.js');


(async () => {
    await requestToJSServer.getAllSkillsFromServer(request);
    // let account = await Account.getAccountById(1);
    // let fullAccount = await Account.getFullAccountByUsername('yasamingol');
    // let result = await account.checkIfSkilledEnough(1);
     await menu.loadMenus();
    // let projectsSkillsMap = await Project.getAllSkillsMapOfProject();
    // console.log(projectsSkillsMap)
})()