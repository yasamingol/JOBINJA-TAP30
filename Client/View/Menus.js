/***************************************************SettingUpDataBase**************************************************/
const databaseClass = require('../DataBase/database');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const controllerClass = require("../Controller/Controller.js");

//using database
(async () => {
    databaseClass.db = await sqlite.open({
        filename: '/home/tapsi/IdeaProjects/concurency/Client/DataBase/database.db',
        driver: sqlite3.Database
    })
    await createAllDataBases();
    await createSomeExampleCases();
    await controllerClass.getAllSkillsFromServer(request);
    await loadMenus();

})()


/****************************************************requirements******************************************************/
//requirements
const request = require('request');
const util = require('util');
const axios = require('axios');
const prompt = require('prompt-sync')();
const colors = require('colors');

//importing classes
const accountClass = require("../Model/Classes/Account");
const projectClass = require("../Model/Classes/Project");
const bidClass = require("../Model/Classes/Bid");
const auctionClass = require("../Model/Classes/Auction");



//global vars
let allSkills = [];

/****************************************************Main-Menus********************************************************/
async function loadMenus() {

    console.log("Welcome to JobInja!".red)
    while (true) {

        //Menus
        let arr = [];
        showAvailableMenus()
        const selectedMenu = prompt("");

        if (selectedMenu === "1") {
            await loadAllProjectsMenu();

        } else if (selectedMenu === "2") {
            await loadViewAvailableProjectsMenu();


        } else if (selectedMenu === "3") {
            await loadGetProjectByIdMenu();


        } else if (selectedMenu === "4") {
            await loadViewAllAccountsMenu();


        } else if (selectedMenu === "5") {
            await loadGetAccountByIdMenu()


        } else if (selectedMenu === "6") {
            await loadAddBidMenu();


        } else if (selectedMenu === "7") {
            await loadConfirmSkillMenu();


        } else if (selectedMenu === "8") {
            await loadAddSkillMenu();


        } else if (selectedMenu === "9") {
            await loadRemoveSkillMenu()


        } else if (selectedMenu === "10") {
            await loadRegisterMenu();


        } else if (selectedMenu === "11") {
            await loadAddProjectMenu();


        } else if (selectedMenu === "12") {
            await loadHoldAuctionMenu();

        } else if (selectedMenu === "13") {
            await loadLoginMenu();

        } else if (selectedMenu === "14") {
            console.log("exit");
            break;

        } else console.log("command is invalid! try again".red);

    }

//serializing in phase_1
//     serializeAllData();
}

/****************************************************MainFunctions*****************************************************/

function showAvailableMenus() {
    console.log("\n MENUS : ".cyan + "\n 1.view all projects \n 2.view available projects \n 3.view project by id " +
        "\n 4.view all accounts \n 5.view account by id \n 6.bid on a project " +
        "\n 7.confirmSkills \n 8.addSkill \n 9.removeSkill \n 10.register \n 11.addProject \n 12.holdAuction" +
        " \n 13.login \n 14.exit \n Please enter the menu number you want to enter : ");
}


async function loadAllProjectsMenu() {
    console.log("\n View all projects menu : ".cyan + "<token>".green);
    let token = prompt("");
    if(!(await checkIfAnyErrorsApearedDuringTokenValidation(token))){
        let projectsArray = await controllerClass.viewAllProjects();
        projectsArray.forEach((project) => {
            console.log(project);
        })
    }

}

async function loadViewAvailableProjectsMenu() {
    console.log("\nWelcome to ((view available projects)) menu!".cyan + " command : <username> <token>".green);
    let inputArr = prompt("").split(" ");
    let username = inputArr[0];
    let token = inputArr[1];
    if(!(await checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        console.log("\n Available projects : ".green);
        let availableProjectsArr = await controllerClass.viewAvailableProjects(username);
        availableProjectsArr.forEach((project) => {
            console.log(project);
        })
    }
}

async function loadGetProjectByIdMenu() {
    console.log("\nWelcome to ((view project)) menu!".cyan + "command : <project-id> <token>".green);
    let inputArr = prompt("").split(" ");
    let projectId = parseInt(inputArr[0]);
    let token = inputArr[1];
    if(!(await checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        console.log(await controllerClass.getProjectById(projectId));
    }
}


async function loadViewAllAccountsMenu() {
    console.log("\nView all accounts menu".cyan + "<token>".green);
    let token = prompt("");
    if(!(await checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        let allAccountsArr = await controllerClass.viewAllAccounts();
        allAccountsArr.forEach((account) => {
            console.log(account);
        })
    }
}


async function loadGetAccountByIdMenu() {
    console.log("Welcome to ((view account)) menu!".cyan + "command : <account-id> <token>".green);
    let inputArr = prompt("").split(" ");
    let accountId = parseInt(inputArr[0]);
    let token = inputArr[1];
    if(!(await checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        console.log(await controllerClass.getAccountById(accountId));
    }
}


async function loadAddBidMenu() {
    console.log("\nwelcome to  bid menu!\nyou can add a new bid using : "
        + "bid <username> <projectTitle> <bidAmount> <token>".green);
    let inputArr = prompt("").split(" ");
    let biddingUsername = inputArr[1];
    let projectTitle = inputArr[2];
    let bidAmount = parseInt(inputArr[3]);
    let token = inputArr[4];
    if(!(await checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        console.log(await controllerClass.addBid(biddingUsername, projectTitle, bidAmount));
    }
}


async function loadConfirmSkillMenu() {
    console.log("\nwelcome to confirmSkill menu!\nyou can confirm a skill using" +
        "confirmSkill <your_username> <other_username> <skill> <token>".green);
    const inputArr = prompt("").split(" ");
    let conformerAccountUsername = inputArr[1];
    let targetAccountUsername = inputArr[2];
    let skillName = inputArr[3];
    let token = inputArr[4];
    if(!(await checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        console.log(await controllerClass.confirmSkill(conformerAccountUsername, targetAccountUsername, skillName));
    }
}


async function loadAddSkillMenu() {
    console.log("\nwelcome to addSkill menu!\nyou can add a skill using" + "addSkill <username> <skill:rate> <token>".green);
    const inputArr = prompt("").split(" ");
    let username = inputArr[1];
    let token = inputArr[3];
    if(!(await checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        let arrSkills = inputArr[2].split(":");
        let skillName = arrSkills[0];
        let skillPoint = arrSkills[1];
        console.log(await controllerClass.addSkill(username, skillName, skillPoint));
    }
}


async function loadRemoveSkillMenu() {
    console.log("\nwelcome to removeSkill menu!\nyou can remove a skill using"
        + "removeSkill <username> <skill> <token>".green);
    const inputArr = prompt("").split(" ");
    let username = inputArr[1];
    let skillName = inputArr[2];
    let token = inputArr[3];
    if(!(await checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        console.log(await controllerClass.removeSkill(username, skillName));
    }
}


async function loadRegisterMenu() {
    console.log("Welcome to ((register)) menu!".cyan + "command : register <username> <password> <skill:point>".green);
    let inputArr = prompt("").split(" ");
    let username = inputArr[1];
    let password = inputArr[2];
    let skillsArr = inputArr.slice(3,inputArr.length);
    let registerMessagesArr = await controllerClass.register(username,skillsArr,password);
    registerMessagesArr.forEach((message) => {
        console.log(message);
    })

}


async function loadAddProjectMenu() {
    console.log("\nwelcome to  addProject menu!\nyou can add a new project using : "
        + "addProject <projectTitle> <skill:rate> <budget> <deadline(year/month/day)> <token>".green);
    let inputArr = prompt("").split(" ");
    let title = inputArr[1];
    let budget = inputArr[inputArr.length - 3];
    let deadLine = inputArr[inputArr.length - 2];
    let skillsArr = inputArr.slice(2, inputArr.length - 3);
    let token = inputArr[inputArr.length-1]
    if(!(await checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        let addProjectArr = await controllerClass.addProject(title, budget, deadLine, skillsArr);
        addProjectArr.forEach((message) => {
            console.log(message);
        })
    }

}


async function loadHoldAuctionMenu() {
    console.log("\nwelcome to  Auction menu!\nyou can hold an Auction for a project: "
        + "holdAuction <projectId> <token>".green);
    let inputArr = prompt("").split(" ");
    let projectId = parseInt(inputArr[1]);
    let token = inputArr[2];
    if(!(await checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        console.log(await controllerClass.holdAuction(projectId));
    }

}
async function loadLoginMenu(){
    console.log("\nwelcome to Login menu!\n you can login: "+"login <username> <password>".green);
    let inputArr = prompt("").split(" ");
    let username = inputArr[1];
    let password = inputArr[2];
    console.log(await controllerClass.login(username,password));
}

/******************************************************Tools**********************************************************/
async function checkIfAnyErrorsApearedDuringTokenValidation(token){
    let {isValid,message} = await controllerClass.validateUserLoginToken(token);
    if(!isValid){
        console.log(message);
        return true;
    }
    else {
        console.log(message);
        return false;
    }
}
/************************************************TestExamplesFormDB***************************************************/

async function createAllDataBases() {
    await databaseClass.createProjectsTable();
    await databaseClass.createAccountsTable();
    await databaseClass.createBidsTable();
    await databaseClass.createAuctionsTable();
    await databaseClass.createSkillsTable();
    await databaseClass.createConfirmationsTable();
    await databaseClass.createLoginsTable();
    console.log("DataBase created successfully :)".green)
}


async function createSomeExampleCases() {
    let project = new projectClass(0, "tap30", -1, 900, -1, "2022/03/03", true);
    let tap30Skill1 = await databaseClass.saveProjectSkill(0, "A", 20, 0);
    let tap30Skill2 = await databaseClass.saveProjectSkill(1, "B", 10, 0);
    await databaseClass.saveProject(project);
    let account = new accountClass(0, "yasamingol","2431380", -1, -1, -1);
    await databaseClass.saveAccount(account);
    let account1 = new accountClass(1, "jafar","1234", -1, -1, -1);
    await databaseClass.saveAccount(account1);
    await databaseClass.saveAccountSkill(2, "A", 200, 0);
    await databaseClass.saveAccountSkill(3, "B", 400, 0);
    await databaseClass.saveAccountSkill(4, "A", 2000, 1);
    await databaseClass.saveAccountSkill(5, "B", 4000, 1);
    let bid1 = new bidClass(0, 0, 0, 20);
    let bid2 = new bidClass(1, 1, 0, 30);
    await databaseClass.saveBid(bid1);
    await databaseClass.saveBid(bid2);
}


