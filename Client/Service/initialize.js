const menu = require('/home/tapsi/IdeaProjects/concurency/Client/Service/Menus.js');
const requestToJSServer = require('/home/tapsi/IdeaProjects/concurency/Client/Business/RequestsToJSServer.js');
const request = require('request');


(async () => {

    await requestToJSServer.getAllSkillsFromServer(request);
    await menu.loadMenus();


})()