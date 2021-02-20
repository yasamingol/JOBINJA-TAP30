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
    await databaseClass.createConfirmationsDB(databaseClass.db);
    console.log("DataBase created successfully :)")
    let project = new projectClass(0, "tap30", -1, 900, -1, "2022/03/03", true);
    let tap30Skill1 = await databaseClass.saveProjectSkillInDB(databaseClass.db, 0, "A", 20, 0);
    let tap30Skill2 = await databaseClass.saveProjectSkillInDB(databaseClass.db, 1, "B", 10, 0);
    await databaseClass.saveProjectInDB(databaseClass.db, project);
    let account = new accountClass(0, "yasamingol", -1, -1, -1);
    await databaseClass.saveAccountInDB(databaseClass.db, account);
    let account1 = new accountClass(1, "jafar", -1, -1, -1);
    await databaseClass.saveAccountInDB(databaseClass.db, account1);
    await databaseClass.saveAccountSkillInDB(databaseClass.db, 2, "A", 200, 0);
    await databaseClass.saveAccountSkillInDB(databaseClass.db, 3, "B", 400, 0);
    await databaseClass.saveAccountSkillInDB(databaseClass.db, 4, "J", 400, 1);
    await getAllSkillsFromServer(request);
    // await databaseClass.saveConfirmationInDB(databaseClass.db,0,4,0);
    // let result = await checkIfConfirmedBefore(0,4);
    // console.log(result);
    await loadMenus();


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
(async () => {
    // await getAllProjectsFromServer(request);
    // await getAllSkillsFromServer(request);
    // await getAllAccountsFromServer(request);
    // await loadMenus();
})();


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
            await viewAllProjects();


        } else if (selectedMenu === "2") {
            console.log("\nWelcome to ((view available projects)) menu!".cyan + " command : <username> ".green);
            command = prompt("");
            console.log("\n Available projects : ".green);
            await viewAvailableProjects(command);


        } else if (selectedMenu === "3") {
            console.log("\nWelcome to ((view project)) menu!".cyan + "command : <project-id>".green);
            command = prompt("");
            await getProjectById(parseInt(command));

        } else if (selectedMenu === "4") {
            console.log("\nView all accounts menu".cyan);
            await viewAllAccounts();


        } else if (selectedMenu === "5") {
            console.log("Welcome to ((view account)) menu!".cyan + "command : <account-id>".green);
            command = prompt("");
            await getAccountById(parseInt(command));


        } else if (selectedMenu === "6") {
            console.log("\nwelcome to  bid menu!\nyou can add a new bid using : " + "bid <username> <projectTitle> <bidAmount>".green);
            const command = prompt("");
            arr = command.split(" ");
            await addBid(arr);


        } else if (selectedMenu === "7") {
            console.log("\nwelcome to confirmSkill menu!\nyou can confirm a skill using" + "confirmSkill <your_username> <other_username> <skill>".green);
            const command = prompt("");
            arr = command.split(" ");
            await confirmSkill(arr);


        } else if (selectedMenu === "8") {
            console.log("\nwelcome to addSkill menu!\nyou can add a skill using" + "addSkill <username> <skill:rate>".green);
            const command = prompt("");
            arr = command.split(" ");
            await addSkill(arr);


        } else if (selectedMenu === "9") {
            console.log("\nwelcome to removeSkill menu!\nyou can remove a skill using" + "removeSkill <username> <skill>".green);
            const command = prompt("");
            arr = command.split(" ");
            await removeSkill(arr);


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


        } else if (selectedMenu === "14") {
            console.log(await databaseClass.getConfirmationsFullDBTable(databaseClass.db));


        } else console.log("command is invalid! try again".red);

    }

//serializing in phase_1
//     serializeAllData();
}

/**************************get/set methods that need to be converted into their own classes***************************/

/***********************************************Main-Functions*********************************************************/
function showAvailableMenus() {
    console.log("\n MENUS : ".cyan + "\n 1.view all projects \n 2.view available projects \n 3.view project by id " +
        "\n 4.view all accounts \n 5.view account by id \n 6.bid on a project " +
        "\n 7.confirmSkills \n 8.addSkill \n 9.removeSkill \n 10.register \n 11.login \n 12.addProject" +
        " \n 13.exit \n Please enter the menu number you want to enter : ");
}

async function viewAllProjects() {
    let numberOfProjects = await databaseClass.getNumberOfRowsOfProjectsFromDB(databaseClass.db);
    for (let i = 0; i < numberOfProjects; i++) {
        let projectsTitle = await databaseClass.getProjectXTitleFromDB(databaseClass.db, i);
        console.log(i + "." + projectsTitle.title);
    }
}

async function viewAvailableProjects(username) {
    let hasMinOneAvailable = false;
    let accountID = await databaseClass.getAccountIDUsingUsernameFromDB(databaseClass.db, username);
    let numberOfProjects = await databaseClass.getNumberOfRowsOfProjectsFromDB(databaseClass.db);
    for (let i = 0; i < numberOfProjects; i++) {
        let projectsTitle = await databaseClass.getProjectXTitleFromDB(databaseClass.db, i);
        if (await checkIfSkilledEnough(accountID.id, i)) {
            console.log(i + "." + projectsTitle.title)
            hasMinOneAvailable = true;
        }
    }
    if (!hasMinOneAvailable) console.log("There is no project available for you now!".red);

}

async function getProjectById(id) {
    let project = await buildFullProjectByGettingID(id);
    console.log(project);
}

async function viewAllAccounts() {
    let numberOfAccounts = await databaseClass.getNumberOfRowsOfAccountsFromDB(databaseClass.db);
    for (let i = 0; i < numberOfAccounts; i++) {
        let accountName = await databaseClass.getAccountXUsernameFromDB(databaseClass.db, i);
        console.log(i + "." + accountName.username);
    }
}

async function getAccountById(id) {
    let account = await buildFullAccountByGettingID(id);
    console.log(account);

}

async function buildFullAccountByGettingID(id) {
    let username = await databaseClass.getAccountXUsernameFromDB(databaseClass.db, id);
    let skills = await getAllSkillsMapOfAccount(id);
    return new accountClass(id, username, skills, -1, -1);

}

async function buildFullProjectByGettingID(id) {
    let title = await databaseClass.getProjectXTitleFromDB(databaseClass.db, id);
    let skills = await getAllSkillsMapOfProject(id);
    let budget = await databaseClass.getProjectXBudgetFromDB(databaseClass.db, id);
    let deadLine = await databaseClass.getProjectXDeadlineFromDB(databaseClass.db, id);
    let isAvailable = await databaseClass.getProjectXIsAvailableFromDB(databaseClass.db, id);
    return new projectClass(id, title, skills, budget, -1, deadLine, isAvailable);

}


function serializeAllData() {
    serializeAccounts();
    serializeProjects();
    serializeBides();
    serializeAuctions();
}

/***********************************************ClientMenu-Functions*****************************************************/
//register
async function register(arr) {
    let id = await databaseClass.getNumberOfRowsOfAccountsFromDB(databaseClass.db);
    let username = arr[1];
    let skills = new Map;
    buildSkillsMap(arr, skills, arr.length);
    let account = new accountClass(id, username, skills, [], new Map);
    await saveRegisterInfoInDB(account);
    console.log("registered successfully!\n".red);

}

async function saveRegisterInfoInDB(account) {
    await databaseClass.saveAccountInDB(databaseClass.db, account);
    let counter = await databaseClass.getNumberOfRowsOfSkillsFromDB(databaseClass.db);
    for (const [key, value] of account.skills) {
        await databaseClass.saveAccountSkillInDB(databaseClass.db, counter, key, value, account.id);
        counter++;
    }
}


//addProject
async function addProject(arr) {
    let id = await databaseClass.getNumberOfRowsOfProjectsFromDB(databaseClass.db);
    let title = arr[1];
    let skills = new Map;
    let budget = arr[arr.length - 2];
    let deadline = stringToDateConverter(arr[arr.length - 1]);
    buildSkillsMap(arr, skills, arr.length - 2);
    let project = new projectClass(id, title, skills, budget, -1, deadline, true);
    await saveAddProjectInfoInDB(project);
    console.log("project built successfully!\n".red);
}

async function saveAddProjectInfoInDB(project) {
    await databaseClass.saveProjectInDB(databaseClass.db, project);
    let counter = await databaseClass.getNumberOfRowsOfSkillsFromDB(databaseClass.db);
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
    let biddingUsername = arr[1];
    let projectTitle = arr[2];
    let bidAmount = parseInt(arr[3]);
    let projectId = await databaseClass.getProjectIDUsingTitleFromDB(databaseClass.db, projectTitle);
    let accountId = await databaseClass.getAccountIDUsingUsernameFromDB(databaseClass.db, biddingUsername);
    let bidId = await databaseClass.getNumberOfRowsOfBidsFromDB(databaseClass.db);
    await handlingAddBidErrors(bidId, accountId.id, projectId.id, bidAmount);

    console.log(await databaseClass.getBidsFullDBTable(databaseClass.db));
}


async function handlingAddBidErrors(bidId, biddingUserId, projectId, bidAmount) {
    if (await !databaseClass.getProjectXIsAvailableFromDB(databaseClass.db, projectId)) {
        console.log("cannot bid! project has already been taken.".red);
    } else if (await !checkIfSkilledEnough(biddingUserId, projectId)) {
        console.log("cannot bid! not skilled enough.".red);
    } else if (await !checkIfBidEnough(projectId, bidAmount)) {
        console.log("cannot bid! bid amount not acceptable".red);
    } else if (await !checkIfValidDateToBid(projectId)) {
        console.log("you cannot bid on this project! it has ended".red);
    } else {
        let bid = new bidClass(bidId, biddingUserId, projectId, bidAmount);
        await databaseClass.saveBidInDB(databaseClass.db, bid);
        console.log("bid created successfully!\n".red);

    }
}

async function checkIfBidEnough(projectId, userBidAmount) {
    let bidIsEnough = false;
    let mainBidAmount = await databaseClass.getProjectXBudgetFromDB(databaseClass.db, projectId);
    if (userBidAmount <= mainBidAmount.budget) bidIsEnough = true;
    return bidIsEnough;
}

async function checkIfValidDateToBid(projectId) {
    let projectDeadline = Date.parse(await databaseClass.getProjectXDeadlineFromDB(databaseClass.db, projectId));
    let localDate = Date.now();
    return projectDeadline >= localDate;

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
async function addSkill(arr) {
    let accountID = await databaseClass.getAccountIDUsingUsernameFromDB(databaseClass.db, arr[1]);
    let skillID = await databaseClass.getNumberOfRowsOfSkillsFromDB(databaseClass.db);
    let arrSkilles = arr[2].split(":");
    if (checkIfSkillIsValid(arrSkilles[0])) {
        await databaseClass.saveAccountSkillInDB(databaseClass.db, skillID, arrSkilles[0], arrSkilles[1], accountID.id);
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

async function removeSkill(arr) {
    console.log(await databaseClass.getSkillsFullDBTable(databaseClass.db))
    let accountID = await databaseClass.getAccountIDUsingUsernameFromDB(databaseClass.db, arr[1]);
    let skillID = await databaseClass.getSkillIdUsingSkillNameAndAccountIDFromDB(databaseClass.db, arr[2], accountID.id);
    if (await checkIfAccountHasSkill(accountID.id, skillID.id)) {
        await databaseClass.deleteSkillOfAccountUsingSkillNameFromDB(databaseClass.db, skillID.id);
        console.log("skill removed successfully!\n".red);
        console.log(await databaseClass.getSkillsFullDBTable(databaseClass.db))

    } else console.log("user does not have such skill!".red);
}

async function checkIfAccountHasSkill(accountID, skillID) {
    let hasThisSkill = false;
    let skillsMap = await getAllSkillsMapOfAccount(accountID);
    let skillName = await databaseClass.getSkillXSkillNameFromDB(databaseClass.db, skillID);
    skillsMap.forEach((value, key) => {
        if (key === skillName.skillName) {
            hasThisSkill = true;
        }
    })
    return hasThisSkill;

}

async function confirmSkill(arr) {
    let sourceUserID = await databaseClass.getAccountIDUsingUsernameFromDB(databaseClass.db, arr[1]);
    let otherUserID = await databaseClass.getAccountIDUsingUsernameFromDB(databaseClass.db, arr[2]);
    let skillID = await databaseClass.getSkillIdUsingSkillNameAndAccountIDFromDB(databaseClass.db, arr[3], otherUserID.id);
    let hasConfirmedBefore = await checkIfConfirmedBefore(sourceUserID.id, skillID.id);
    if (!hasConfirmedBefore) {
        await addPointTOSkillForConfirmation(skillID.id);
        await createNewConfirmation(skillID.id, sourceUserID.id);
        console.log(arr[1] + " confirmed " + arr[2] + " s ((" + arr[3] + ")) skill\n ");
    } else console.log("cannot confirm this skillSet! you have done it once before!".red);

}

async function addPointTOSkillForConfirmation(skillId) {
    let skillPoint = await databaseClass.getSkillXSkillPointFromDB(databaseClass.db, skillId);
    await databaseClass.updateAccountSkillPointInDB(databaseClass.db, skillId, skillPoint.skillPoint + 1);
}

async function createNewConfirmation(skillId, sourceUserId) {
    let confirmationId = await databaseClass.getNumberOfRowsOfConfirmationFromDB(databaseClass.db);
    await databaseClass.saveConfirmationInDB(databaseClass.db, confirmationId, skillId, sourceUserId);
}

async function checkIfConfirmedBefore(userSourceID, skillID) {
    let result = await databaseClass.getConfirmationFromDB(databaseClass.db, skillID, userSourceID);
    if (result === undefined) return false;
    else return true;
}


async function checkIfSkilledEnough(accountID, projectID) {
    let isSkilled = true;
    let projectsSkillsMap = await getAllSkillsMapOfProject(projectID);
    let accountsSkillsMap = await getAllSkillsMapOfAccount(accountID);
    projectsSkillsMap.forEach((value1, key1) => {
        if (accountsSkillsMap.has(key1)) {
            if (parseInt(accountsSkillsMap.get(key1)) < parseInt(value1)) {
                isSkilled = false;
            }
        } else isSkilled = false;
    })
    return isSkilled;

}

async function getAllSkillsMapOfAccount(accountID) {
    let skillArray = await databaseClass.getSkillsOfAccountXFromDB(databaseClass.db, accountID);
    return await convertSkillsArrayToSkillsMap(skillArray);
}

async function getAllSkillsMapOfProject(projectID) {
    let skillsArray = await databaseClass.getSkillsOfProjectXFromDB(databaseClass.db, projectID);
    return await convertSkillsArrayToSkillsMap(skillsArray);
}

async function convertSkillsArrayToSkillsMap(arr) {
    let skillMap = new Map();
    for (let i = 0; i < arr.length; i++) {
        let skillID = arr[i].id;
        let skillName = await databaseClass.getSkillXSkillNameFromDB(databaseClass.db, skillID);
        let skillPoint = await databaseClass.getSkillXSkillPointFromDB(databaseClass.db, skillID);
        skillMap.set(skillName.skillName, skillPoint.skillPoint);
    }
    return skillMap;
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

async function getProjectByIdUsingAPI(request, id) {
    const promisifiedRequest = util.promisify(request);
    const {error, response, body} = await promisifiedRequest('http://localhost:3000/api/projects/' + id);
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log(JSON.parse(body));
}

async function getAccountByIDUsingAPI(request, id) {
    const promisifiedRequest = util.promisify(request);
    const {error, response, body} = await promisifiedRequest('http://localhost:4000/api/accounts/' + id);
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log(JSON.parse(body));

}
