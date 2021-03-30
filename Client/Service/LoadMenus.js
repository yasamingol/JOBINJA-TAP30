/****************************************************requirements******************************************************/
const prompt = require('prompt-sync')();
const AllProjects = require('/home/tapsi/IdeaProjects/concurency/Client/Service/AllServices/AllProjects.js');
const AvailableProjects = require('/home/tapsi/IdeaProjects/concurency/Client/Service/AllServices/AvailableProjects.js');
const GetProjectById = require('/home/tapsi/IdeaProjects/concurency/Client/Service/AllServices/GetProjectById.js');
const AllAccounts = require('/home/tapsi/IdeaProjects/concurency/Client/Service/AllServices/AllAccounts.js');
const GetAccountById = require('/home/tapsi/IdeaProjects/concurency/Client/Service/AllServices/GetAccountById.js');
const AddBid  = require('/home/tapsi/IdeaProjects/concurency/Client/Service/AllServices/AddBid.js');
const SkillConfirmation = require('/home/tapsi/IdeaProjects/concurency/Client/Service/AllServices/ConfirmSkill.js');
const AddSkill = require('/home/tapsi/IdeaProjects/concurency/Client/Service/AllServices/AddSkill.js');
const RemoveSkill = require('/home/tapsi/IdeaProjects/concurency/Client/Service/AllServices/RemoveSkill.js');
const Register = require('/home/tapsi/IdeaProjects/concurency/Client/Service/AllServices/Register.js');
const AddProject = require('/home/tapsi/IdeaProjects/concurency/Client/Service/AllServices/AddProject.js');
const HoldAuction = require('/home/tapsi/IdeaProjects/concurency/Client/Service/AllServices/HoldAuction.js');
const Login = require('/home/tapsi/IdeaProjects/concurency/Client/Service/AllServices/Login.js');
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');
/***************************************************Main-Menus********************************************************/

async function loadMenus() {

    console.log(Messages.WelcomToJobinja)
    while (true) {

        //Menus
        console.log(Messages.AvailableMenus);

        const selectedMenu = prompt("");

        if (selectedMenu === "1") {
            await AllProjects.loadAllProjectsMenu();

        } else if (selectedMenu === "2") {
            await AvailableProjects.loadViewAvailableProjectsMenu();


        } else if (selectedMenu === "3") {
            await GetProjectById.loadGetProjectByIdMenu();


        } else if (selectedMenu === "4") {
            await AllAccounts.loadViewAllAccountsMenu();


        } else if (selectedMenu === "5") {
            await GetAccountById.loadGetAccountByIdMenu();


        } else if (selectedMenu === "6") {
            await AddBid.loadAddBidMenu();


        } else if (selectedMenu === "7") {
            let confirmationMessage = await SkillConfirmation.loadConfirmSkillMenu();
            console.log(confirmationMessage);


        } else if (selectedMenu === "8") {
            let addSkillMessage = await AddSkill.loadAddSkillMenu();
            console.log(addSkillMessage);


        } else if (selectedMenu === "9") {
            let removeSkillMessage = await RemoveSkill.loadRemoveSkillMenu();
            console.log(removeSkillMessage);


        } else if (selectedMenu === "10") {
            let registrationMessage = await Register.loadRegisterMenu();
            console.log(registrationMessage);


        } else if (selectedMenu === "11") {
            let addProjectMessage = await AddProject.loadAddProjectMenu();
            console.log(addProjectMessage);


        } else if (selectedMenu === "12") {
            let holdAuctionMessage = await HoldAuction.loadHoldAuctionMenu();
            console.log(holdAuctionMessage);


        } else if (selectedMenu === "13") {
            let loginMessage = await Login.loadLoginMenu();
            console.log(loginMessage);

        } else if (selectedMenu === "14") {
            console.log("exit");
            break;

        } else console.log(Messages.CommandIsInvalidError);

    }

}


module.exports = {
    loadMenus

}


