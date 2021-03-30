const menu = require('/home/tapsi/IdeaProjects/concurency/Client/Service/LoadMenus.js');
const requestToJSServer = require('/home/tapsi/IdeaProjects/concurency/Client/Business/RequestsToJSServer.js');
const request = require('request');
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');


(async () => {
    await requestToJSServer.getAllSkillsFromServer(request);
    await menu.loadMenus();
})()