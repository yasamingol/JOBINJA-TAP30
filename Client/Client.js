/************************************************SettingUp-DataBase*************************************************/
const databaseClass = require('../DataBase/database');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

//using database
(async () => {
    databaseClass.db = await sqlite.open({
        filename: '/home/tapsi/IdeaProjects/concurency/DataBase/database.db',
        driver: sqlite3.Database
    })
    await databaseClass.createProjectsDB(databaseClass.db);
    await databaseClass.createAccountsDB(databaseClass.db);
    await databaseClass.createBidsDB(databaseClass.db);
    await databaseClass.createAuctionsDB(databaseClass.db);
    await databaseClass.createSkillsDB(databaseClass.db);
    console.log("DataBase created succesfully :)")
    // await loadMenus();

    //test
    let project = new projectClass(0,"tap30",-1,900,-1,"2022/03/03",true);
    await databaseClass.saveProjectInDB(databaseClass.db,project);
    let projectPrime = await projectClass.getProjectByTitle("tap30");
    console.log("salam salam");



})()


/****************************************************Preperation******************************************************/
//requirements
const request = require('request');
const util = require('util');
const axios = require('axios')
//importing classes
const accountClass = require("../Classes/Account");
const projectClass = require("../Classes/Project");
const bidClass = require("../Classes/Bid");
const auctionClass = require("../Classes/Auction");
//global vars
let allSkills = [];

//using API to get DATA
/*
(async () => {
    await getAllProjectsFromServer(request);
    await getAllSkillsFromServer(request);
    await getAllAccountsFromServer(request);
    await loadMenus();
})();

 */


/***************************************************Main-Menus********************************************************/
async function loadMenus() {
    const prompt = require('prompt-sync')();
    const colors = require('colors');
    let command;
    console.log("Welcome to JobInja!".red)
    let commandIsValid = false;
    while (!commandIsValid) {

        //checking the expiration date for auctions
        // holdAuctions();

        //Menus
        let arr = [];
        showAvailableMenus()
        const selectedMenu = prompt("");

        if (selectedMenu === "1") {
            console.log("\n View all projects menu :".cyan);
            viewAllProjects();


        } else if (selectedMenu === "2") {
            console.log("\nWelcome to ((view available projects)) menu!".cyan + " command : <username> ".green);
            command = prompt("");
            viewAvailableProjects(command);


        } else if (selectedMenu === "3") {
            console.log("\nWelcome to ((view project)) menu!".cyan + "command : <project-id>".green);
            command = prompt("");
            await getProjectById(request, command);

        } else if (selectedMenu === "4") {
            console.log("\nView all accounts menu".cyan);
            viewAllAccounts();


        } else if (selectedMenu === "5") {
            console.log("Welcome to ((view account)) menu!".cyan + "command : <account-id>".green);
            command = prompt("");
            await getAccountByID(request, command);


        } else if (selectedMenu === "6") {
            console.log("\nwelcome to  bid menu!\nyou can add a new bid using : " + "bid <username> <projectTitle> <bidAmount>".green);
            const command = prompt("");
            arr = command.split(" ");
            addBid(arr);


        } else if (selectedMenu === "7") {
            console.log("\nwelcome to confirmSkill menu!\nyou can confirm a skill using" + "confirmSkill <your_username> <other_username> <skill>".green);
            const command = prompt("");
            arr = command.split(" ");
            confirmSkill(arr);


        } else if (selectedMenu === "8") {
            console.log("\nwelcome to addSkill menu!\nyou can add a skill using" + "addSkill <username> <skill:rate>".green);
            const command = prompt("");
            arr = command.split(" ");
            addSkill(arr);


        } else if (selectedMenu === "9") {
            console.log("\nwelcome to removeSkill menu!\nyou can remove a skill using" + "removeSkill <username> <skill>".green);
            const command = prompt("");
            arr = command.split(" ");
            removeSkill(arr);


        } else if (selectedMenu === "10") {
            console.log("Welcome to ((register)) menu!".cyan + "command : register <username> <skill:point> ".green);
            command = prompt("");
            arr = command.split(" ");
            await register(arr);


        } else if (selectedMenu === "11") {
            console.log("\nWelcome to login menu! You log into your accout : " + "login <username> <skill:rate> ".green);


        } else if (selectedMenu === "12") {
            console.log("\nwelcome to  addProject menu!\nyou can add a new project using : " + "addProject <projectTitle> <skill:rate> <budget> <deadline(year/month/day)>".green);
            // const command = readOneLine();
            const command = prompt("");
            arr = command.split(" ");
            await addProject(arr);


        } else if (selectedMenu === "13") {
            console.log("exit");
            commandIsValid = true;


        } else console.log("command is invalid! try again".red);

    }

//serializing
    serializeAllData();
}

/***********************************************Main-Functions*********************************************************/
function showAvailableMenus() {
    console.log("\n MENUS : ".cyan + "\n 1.view all projects \n 2.view available projects \n 3.view project by id " +
        "\n 4.view all accounts \n 5.view account by id \n 6.bid on a project " +
        "\n 7.confirmSkills \n 8.addSkill \n 9.removeSkill \n 10.register \n 11.login \n 12.addProject" +
        " \n 13.exit \n Please enter the menu number you want to enter : ");
}

function viewAllProjects() {
    projectClass.allProjects.forEach((project) => {
        console.log(project.id + "." + project.title);
    })
}

function viewAvailableProjects(command) {
    let hasMinOneAvailable = false;
    projectClass.allProjects.forEach((project) => {
        if (checkIfSkilledEnough(command, project.title)) {
            console.log(" Available projects :\n ".green + project.id + "." + project.title);
            hasMinOneAvailable = true;
        }
    })
    if (!hasMinOneAvailable) console.log("There is no project available for you now!".red);

}

function viewAllAccounts() {
    accountClass.allAccounts.forEach((account) => {
        console.log(account.id + "." + account.username);
    })
}

function serializeAllData() {
    serializeAccounts();
    serializeProjects();
    serializeBides();
    serializeAuctions();
}

/**********************************************Calling-API_Server-Methods*********************************************/

async function getAllProjectsFromServer(request) {
    const promisifiedRequest = util.promisify(request);
    const {error, response, body} = await promisifiedRequest('http://localhost:3000/api/projects');
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    deserializeAllProjects(JSON.parse(body));
}

async function getAllSkillsFromServer(request) {
    const promisifiedRequest = util.promisify(request);
    const {error, response, body} = await promisifiedRequest('http://localhost:5000/api/skills');
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    deserializeAllSkills(body);

}

async function getAllAccountsFromServer(request) {
    const promisifiedRequest = util.promisify(request);
    const {error, response, body} = await promisifiedRequest('http://localhost:4000/api/accounts');
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    deserializeAllAccounts(JSON.parse(body));
}

async function getProjectById(request, id) {
    const promisifiedRequest = util.promisify(request);
    const {error, response, body} = await promisifiedRequest('http://localhost:3000/api/projects/' + id);
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log(JSON.parse(body));
}

async function getAccountByID(request, id) {
    const promisifiedRequest = util.promisify(request);
    const {error, response, body} = await promisifiedRequest('http://localhost:4000/api/accounts/' + id);
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log(JSON.parse(body));

}

/***********************************************ClientMenu-Functions*****************************************************/
//register
async function register(arr) {
    let username = arr[1];
    let skills = new Map;
    buildSkillsMap(arr, skills, arr.length);
    let account = new accountClass(0, username, skills, [], new Map);
    await saveRegisterInfoInDB(account);
    console.log("registered successfully!\n".red);

}

async function saveRegisterInfoInDB(account) {
    await databaseClass.saveAccountInDB(databaseClass.db, account);
    let counter = 0;
    for (const [key, value] of account.skills) {
        await databaseClass.saveAccountSkillInDB(databaseClass.db, counter, key, value, account.id);
        counter++;
    }
}


//addProject
async function addProject(arr) {
    let title = arr[1];
    let skills = new Map;
    let budget = arr[arr.length - 2];
    let deadline = stringToDateConverter(arr[arr.length - 1]);
    buildSkillsMap(arr, skills, arr.length - 2);
    let project = new projectClass(0, title, skills, budget, [], deadline, true);
    await saveAddProjectInfoInDB(project);
    console.log("project built successfully!\n".red);
}

async function saveAddProjectInfoInDB(project) {
    await databaseClass.saveProjectInDB(databaseClass.db, 0, project);
    let counter = 0;
    for (const [key, value] of project.skills) {
        await databaseClass.saveProjectSkillInDB(databaseClass.db, counter, key, value, project.id);
        counter++
    }
}

function buildSkillsMap(arr, skills, length) {
    for (let i = 2; i < length; i++) {
        let arrSkiles = [];
        arrSkiles = arr[i].split(":");
        skills.set(arrSkiles[0], arrSkiles[1]);

    }
}


//addBid
async function addBid(arr) {
    let biddingUser = arr[1];
    let projectTitle = arr[2];
    let bidAmount = arr[3];
    let bid = await handlingAddBidErrors(biddingUser, projectTitle, bidAmount);
    // let projectId = await projectClass.getProjectByTitle(projectTitle).listOfBids.push(bid);
    await databaseClass.saveBidInDB(databaseClass.db, bid);
    console.log("bid created successfully!\n".red);
}

async function handlingAddBidErrors(biddingUser, projectTitle, bidAmount) {
    if (!projectClass.getProjectByTitle(projectTitle).isAvailable) {
        console.log("cannot bid! project has already been taken.".red);
    } else if (!checkIfSkilledEnough(biddingUser, projectTitle)) {
        console.log("cannot bid! not skilled enough.".red);
    } else if (!checkIfBidEnough(projectTitle, bidAmount)) {
        console.log("cannot bid! bid amount not acceptable".red);
    } else if (!checkIfValidDateToBid(projectTitle)) {
        console.log("you cannot bid on this project! it has ended".red);
    } else {
        return new bidClass(biddingUser, projectTitle, bidAmount);

    }
}


//holdAuctions
function holdAuctions() {
    projectClass.allProjects.forEach((project) => {
        let projectName = project.title;
        if (isAuctionDate(projectName)) {
            holdAuction(projectName);
        }
    })
}

function holdAuction(projectName) {
    let project = projectClass.getProjectByTitle(projectName);
    let accountWinner = calculateBestBid(project);
    new auctionClass(projectName, accountWinner);
    project.isAvailable = false;
    assignProject(accountWinner, projectName);
    console.log("\nThe winner of the auction is : ".red + accountWinner.red);
    return accountWinner;
}


function isAuctionDate(projectName) {
    let projectDeadline = projectClass.getProjectByTitle(projectName).deadline;
    let localDate = Date.now();
    return projectDeadline <= localDate;

}

function calculateBestBid(project) {
    let bestBid = 0;
    let bestBidsAccount;
    project.listOfBids.forEach((bid) => {
        let userSkill = parseInt(calculateUserSkill(bid));
        if (userSkill > bestBid) {
            bestBid = userSkill;
            bestBidsAccount = accountClass.getAccountByUsername(bid.username);
        }
    });
    return bestBidsAccount.username;
}

function assignProject(username, projectName) {
    let account = accountClass.getAccountByUsername(username);
    account.asignedProjectList.push(projectName);
}


//add/remove/confirm Skill
function addSkill(arr) {
    let account = accountClass.getAccountByUsername(arr[1]);
    let arrSkiles = [];
    arrSkiles = arr[2].split(":");
    if (checkIfSkillIsValid(arrSkiles[0])) {
        account.skills.set(arrSkiles[0], arrSkiles[1]);
        console.log("skill added successfully!\n".red);
    } else console.log("such skill does not exist!".red);
}

function checkIfSkillIsValid(givenSkill) {
    let skillIsValid = false;
    allSkills.forEach((skill) => {
        if (skill.name === givenSkill) skillIsValid = true;
    })
    return skillIsValid;
}

function removeSkill(arr) {
    let account = accountClass.getAccountByUsername(arr[1]);
    let skillName = arr[2];
    if (checkIfAccountHasSkill(account, skillName)) {
        account.skills.delete(skillName);
        console.log("skill removed successfully!\n".red);
    } else console.log("user does not have such skill!".red);
}

function checkIfAccountHasSkill(account, skillName) {
    let hasThisSkill = false;
    account.skills.forEach((value, key) => {
        if (key === skillName) {
            hasThisSkill = true;
        }
    })
    return hasThisSkill;

}


function confirmSkill(arr) {
    let thisUser = accountClass.getAccountByUsername(arr[1]);
    let otherUser = accountClass.getAccountByUsername(arr[2]);
    let skillName = arr[3];
    if (!checkIfConfirmedBefore(thisUser, otherUser, skillName)) {
        let skillRate = otherUser.skills.get(skillName);
        otherUser.skills.delete(skillName);
        otherUser.skills.set(skillName, parseInt(skillRate) + 1);
        thisUser.skillConfirmationList.set(otherUser.username, skillName);
        console.log(arr[1] + " confirmed " + arr[2] + " s ((" + arr[3] + ")) skill\n ");
    } else console.log("cannot confirm this skillSet! you have done it once before!".red);

}

function checkIfConfirmedBefore(user1, user2, skill) {
    if (user1.skillConfirmationList.has(user2, skill)) {
        let skillFound = user1.skillConfirmationList.get(user2);
        if (skillFound === skill) {
            return true;
        } else return false
    } else return false

}


function checkIfSkilledEnough(userName, projectName) {
    let isSkilled = true;
    let account = accountClass.getAccountByUsername(userName);
    let project = projectClass.getProjectByTitle(projectName);
    project.skills.forEach((value1, key1) => {
        if (account.skills.has(key1)) {
            if (parseInt(account.skills.get(key1)) < parseInt(value1)) {
                isSkilled = false;
            }
        } else isSkilled = false;
    })
    return isSkilled;

}


function checkIfBidEnough(projectName, userBidAmount) {
    let mainBidAmount = projectClass.getProjectByTitle(projectName).budget;
    if (parseInt(userBidAmount) <= parseInt(mainBidAmount)) return true;
    else return false;
}

function checkIfValidDateToBid(projectName) {
    let projectDeadline = Date.parse(projectClass.getProjectByTitle(projectName).deadline);
    let localDate = Date.now();
    return projectDeadline >= localDate;

}


function calculateUserSkill(bid) {
    let project = projectClass.getProjectByTitle(bid.projectaTitle);
    let account = accountClass.getAccountByUsername(bid.username);
    let jobOffer = project.budget;
    let userOffer = bid.bidAmount;
    let skillSum = 0;
    project.skills.forEach((value, key) => {
        let jobSkill = parseInt(value);
        let userSkill = parseInt(account.skills.get(key));
        skillSum += 1000 * ((userSkill - jobSkill) * (userSkill - jobSkill));
    })
    return skillSum + (jobOffer - userOffer);
}


/***********************************************Tool-Functions*********************************************************/

function mapToObj(map) {
    const obj = {}
    for (let [k, v] of map)
        obj[k] = v
    return obj
}

function objToMap(myObject) {
    const map = new Map;
    myObject.forEach((element) => {
        map.set(element["name"], element["point"]);
    });
    return map;

}

function stringToDateConverter(string) {
    let arr = string.split("/");
    let date = new Date(arr[0], arr[1], arr[2], 0, 0, 0);
    console.log(date);
    return date;
}

/***************************************************Serialize*********************************************************/

function serialize(name, jsonContent) {
    const fs = require('fs');
    fs.appendFile(name + ".json", jsonContent, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!".yellow);
    });

}

function serializeAccounts() {
    for (let i = 0; i < accountClass.allAccounts.length; i++) {
        let account = accountClass.allAccounts[i];
        let json = serializeAccount(account);
        serialize("/home/tapsi/IdeaProjects/concurency/Client/Client-DataBase/Accounts/allAccounts" + "_" + i, json);

    }
}

function serializeAccount(account) {
    const myJson = {};
    myJson.id = account.id;
    myJson.username = account.username;
    myJson.skills = mapToObj(account.skills);
    myJson.asignedProjectList = account.asignedProjectList;
    myJson.skillConfirmationList = mapToObj(account.skillConfirmationList);
    const json = JSON.stringify(myJson);
    return json;
}

function serializeProjects() {
    for (let i = 0; i < projectClass.allProjects.length; i++) {
        let project = projectClass.allProjects[i];
        const myJson = {};
        myJson.id = project.id;
        myJson.title = project.title;
        myJson.skills = mapToObj(project.skills);
        myJson.budget = project.budget;
        myJson.deadline = project.deadline;
        myJson.isAvailable = project.isAvailable;
        const json = JSON.stringify(myJson);
        serialize("/home/tapsi/IdeaProjects/concurency/Client/Client-DataBase/Projects/allProjects" + "_" + i, json);

    }
}


function serializeBides() {
    for (let i = 0; i < bidClass.allBids.length; i++) {
        let bid = bidClass.allBids[i];
        const myJson = {};
        myJson.id = bid.id;
        myJson.username = bid.username;
        myJson.projectaTitle = bid.projectaTitle;
        myJson.bidAmount = bid.bidAmount;
        const json = JSON.stringify(myJson);
        serialize("/home/tapsi/IdeaProjects/concurency/Client/Client-DataBase/Bids/allBids" + "_" + i, json);


    }
}

function serializeAuctions() {
    for (let i = 0; i < auctionClass.allAuctions.length; i++) {
        let auction = auctionClass.allAuctions[i];
        const myJson = {};
        myJson.id = auction.id;
        myJson.projecTitle = auction.projectTitle;
        myJson.usernameWinner = auction.accuntWinner;
        const json = JSON.stringify(myJson);
        serialize("/home/tapsi/IdeaProjects/concurency/Client/Client-DataBase/Auction/allAuctions" + "_" + i, json);


    }

}

/**************************************************Deserialize********************************************************/

function deserializeAllAccounts(arr) {
    // username, skills,asignedProjectList,skillConfirmationList
    for (let i = 0; i < arr.length; i++) {
        let id = arr[i].id;
        let username = arr[i].username;
        let skillsArr = objToMap(arr[i].skills);
        let asignedProjectList = arr[i].asignedProjectList;
        let skillConfirmationList = objToMap(arr[i].skillConfirmationList);
        new accountClass(id, username, skillsArr, asignedProjectList, skillConfirmationList);
    }
}

function deserializeAllProjects(arr) {
    for (let i = 0; i < arr.length; i++) {
        let id = arr[i].id;
        let title = arr[i].title;
        let skillsArr = objToMap(arr[i].skills);
        let budget = arr[i].budget;
        let listOfBids = arr[i].listOfBids;
        let deadline = arr[i].deadline;
        let isAvailable = arr[i].isAvailable;
        new projectClass(id, title, skillsArr, budget, listOfBids, deadline, isAvailable);
    }
}

function deserializeAllSkills(body) {
    allSkills = JSON.parse(body);
}

module.exports = {holdAuction, calculateBestBid, calculateUserSkill, checkIfSkilledEnough, checkIfBidEnough};
