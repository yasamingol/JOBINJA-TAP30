/****************************************************Requirements******************************************************/
//requirements
const request = require('request');
const util = require('util');
const axios = require('axios');
const prompt = require('prompt-sync')();
const colors = require('colors');
const jwt = require('jsonwebtoken');

//importing classes
const accountClass = require("../Model/Classes/Account");
const projectClass = require("../Model/Classes/Project");
const bidClass = require("../Model/Classes/Bid");
const auctionClass = require("../Model/Classes/Auction");
const viewClass = require("../View/Menus.js");
const databaseClass = require('../DataBase/database.js');


/***********************************************MainFunctionsInMenu***************************************************/

async function getProjectById(id) {
    let project = await buildFullProjectByGettingID(id);
    return project;
}


async function getAccountById(id) {
    let account = await buildFullAccountByGettingID(id);
    return account;

}

async function buildFullAccountByGettingID(id) {
    let accountFullString = await databaseClass.getFullAccountById(id);
    let username = accountFullString.username;
    let password = accountFullString.password;
    let skills = await getAllSkillsMapOfAccount(id);
    let assignedProjectList = await databaseClass.getAllProjectsAssignedToAnAccountUsingAccountId(id);
    return new accountClass(id, username, password, skills, assignedProjectList, null);

}

async function buildFullProjectByGettingID(id) {
    let projectFullString = await databaseClass.getProjectByID(id);
    let title = projectFullString.title
    let skills = await getAllSkillsMapOfProject(id);
    let budget = projectFullString.budget;
    let deadLine = projectFullString.deadline;
    let isAvailable = projectFullString.isAvailable;
    let assignedAccountId = projectFullString.assignedAccountId;
    let listOfBids = await createListOfBidsForProject(id);

    return new projectClass(id, title, skills, budget, listOfBids,
        deadLine, isAvailable, assignedAccountId);

}

async function buildFullBidUsingBidID(bidID) {
    let userId = await databaseClass.getBidsUserIDUsingBidId(bidID);
    let projectId = await databaseClass.getBidsProjectIdUsingBidId(bidID);
    let bidAmount = await databaseClass.getBidsAmountUsingBidId(bidID);
    return new bidClass(bidID, userId, projectId, bidAmount);
}

async function viewAllAccounts() {
    let allAccountsArr = [];
    let numberOfAccounts = await databaseClass.getNumberOfRowsOfAccountsTable();
    for (let i = 0; i < numberOfAccounts; i++) {
        let accountName = await databaseClass.getAccountUsernameUsingAccountId(i);
        allAccountsArr[i] = (i + "." + accountName);
    }
    return allAccountsArr;
}

async function viewAllProjects() {
    let allProjectsArray = [];
    let numberOfProjects = await databaseClass.getNumberOfRowsInProjectsTable();
    for (let i = 0; i < numberOfProjects; i++) {
        let projectsTitle = await databaseClass.getProjectTitleUsingProjectId(i);
        allProjectsArray[i] = (i + "." + projectsTitle);
    }
    return allProjectsArray;
}

async function getAllSkillsMapOfAccount(accountID) {
    let skillArray = await databaseClass.getSkillsOfAccountUsingAccountId(accountID);
    return await convertSkillsArrayToSkillsMap(skillArray);
}

async function getAllSkillsMapOfProject(projectID) {
    let skillsArray = await databaseClass.getSkillsOfProjectUsingProjectId(projectID);
    return await convertSkillsArrayToSkillsMap(skillsArray);
}

/*****************************************Logical/Computational-Functions*********************************************/

async function viewAvailableProjects(username) {
    let error = [];
    let accountID = await databaseClass.getAccountIDUsingAccountUsername(username);
    let numberOfProjects = await databaseClass.getNumberOfRowsInProjectsTable();
    let {availableProjectArr, hasMinOneAvailable} = await buildAvailableProjects(accountID, numberOfProjects);
    if (hasMinOneAvailable) {
        return availableProjectArr;
    } else {
        error[0] = "There are no projects available for you now!".red;
        return error;
    }
}

async function buildAvailableProjects(accountID, numberOfProjects) {
    let availableProjectArr = [];
    let hasMinOneAvailable = false;
    for (let i = 0; i < numberOfProjects; i++) {
        let projectsTitle = await databaseClass.getProjectTitleUsingProjectId(i);
        if (await checkIfSkilledEnough(accountID, i)) {
            availableProjectArr[i] = (i + "." + projectsTitle);
            hasMinOneAvailable = true;
        }
    }
    return {
        availableProjectArr: availableProjectArr,
        hasMinOneAvailable: hasMinOneAvailable
    };
}

//register
async function register(username, skillsArr, password) {
    let messagesDuringRegistration;
    let id = await databaseClass.getNumberOfRowsOfAccountsTable();
    let skills = new Map;
    messagesDuringRegistration = buildSkillsMap(skillsArr, skills);
    let account = new accountClass(id, username, password, skills, [], new Map);
    await saveRegisterInfoInDB(account);
    messagesDuringRegistration[messagesDuringRegistration.length] = ("registered successfully!\n".green);
    return messagesDuringRegistration;

}

async function saveRegisterInfoInDB(account) {
    await databaseClass.saveAccount(account);
    let counter = await databaseClass.getNumberOfRowsInSkillsTable();
    for (const [key, value] of account.skills) {
        await databaseClass.saveAccountSkill(counter, key, value, account.id);
        counter++;
    }
}


//addProject
async function addProject(title, budget, deadLine, skillsArr) {
    let messagesDuringAddProject;
    let id = await databaseClass.getNumberOfRowsInProjectsTable();
    let skills = new Map;
    let deadline = stringToDateConverter(deadLine);
    messagesDuringAddProject = buildSkillsMap(skillsArr, skills);
    let project = new projectClass(id, title, skills, budget, null, deadline, true, null);
    await saveProjectInfo(project);
    messagesDuringAddProject[messagesDuringAddProject.length] = ("project built successfully!\n".green);
    return messagesDuringAddProject;
}

async function saveProjectInfo(project) {
    await databaseClass.saveProject(project);
    let counter = await databaseClass.getNumberOfRowsInSkillsTable();
    for (const [key, value] of project.skills) {
        await databaseClass.saveProjectSkill(counter, key, value, project.id);
        counter++
    }
}

function buildSkillsMap(skillsArr, skills) {
    let arrOfMessagesWhileBuildingSKillsMap = [];
    for (let i = 0; i < skillsArr.length; i++) {
        let arrSkills = skillsArr[i].split(":");
        let skillName = arrSkills[0];
        let skillPoint = arrSkills[1];
        if (checkIfSkillIsValid(skillName)) {
            skills.set(skillName, skillPoint);
            arrOfMessagesWhileBuildingSKillsMap[i] = ("skill ".green + skillName.green + " added successfully".green);
        } else {
            arrOfMessagesWhileBuildingSKillsMap[i] = ("skill ".red + skillName.red + " is invalid".red);
        }

    }
    return arrOfMessagesWhileBuildingSKillsMap;
}

//addBid
async function addBid(biddingUsername, projectTitle, bidAmount) {
    let addBidsFinalMessage;
    let projectId = await databaseClass.getProjectIDUsingProjectTitle(projectTitle);
    let accountId = await databaseClass.getAccountIDUsingAccountUsername(biddingUsername);
    let bidId = await databaseClass.getNumberOfRowsInBidsTable();
    addBidsFinalMessage = await handlingAddBidErrors(bidId, accountId, projectId, bidAmount);
    return addBidsFinalMessage;
}


async function handlingAddBidErrors(bidId, biddingUserId, projectId, bidAmount) {

    if (!(await databaseClass.getProjectAvailabilityUsingProjectId(projectId))) {
        return "cannot bid! project has already been taken.".red;
    } else if (!(await checkIfSkilledEnough(biddingUserId, projectId))) {
        return "cannot bid! not skilled enough.".red;
    } else if (!(await checkIfBidEnough(projectId, bidAmount))) {
        return "cannot bid! bid amount not acceptable".red;
    } else if (!(await checkIfValidDateToBid(projectId))) {
        return "you cannot bid on this project! it has ended".red;
    } else {
        return (await createBid(bidId, biddingUserId, projectId, bidAmount));
    }
}

async function createBid(bidId, biddingUserId, projectId, bidAmount) {
    let bid = new bidClass(bidId, biddingUserId, projectId, bidAmount);
    await databaseClass.saveBid(bid);
    return "bid created successfully!\n".green;

}

async function checkIfBidEnough(projectId, userBidAmount) {
    let bidIsEnough = false;
    let mainBidAmount = await databaseClass.getProjectBudgetUsingProjectId(projectId);
    if (userBidAmount <= mainBidAmount) bidIsEnough = true;
    return bidIsEnough;
}

async function checkIfValidDateToBid(projectId) {
    let time = await databaseClass.getProjectDeadlineUsingProjectId(projectId);
    let projectDeadline = Date.parse(time);
    let localDate = Date.now();
    return projectDeadline >= localDate;

}

//holdAuctions
async function holdAuctionsForAllProjects() {
    let numberOfProjects = await databaseClass.getNumberOfRowsInProjectsTable();
    for (let i = 0; i < numberOfProjects; i++) {
        let projectID = i;
        if (await isAuctionDay(projectID)) {
            await holdAuction(projectID);
        }
    }
}

async function holdAuction(projectId) {
    let messageOfHoldAuction = "";
    if (!(await databaseClass.getProjectAvailabilityUsingProjectId(projectId))) {
        messageOfHoldAuction = ("project is not available! already taken.".red);
    } else {
        messageOfHoldAuction = await handlingAuctionProcess(projectId);
    }
    return messageOfHoldAuction;
}


async function handlingAuctionProcess(projectId) {
    let messageOfHoldAuction = "";
    let accountWinnerID = await findTheBestUserIdBidingOnProject(projectId);
    if (accountWinnerID !== null) {
        await createNewAuction(accountWinnerID, projectId);
        await databaseClass.updateProjectAvailability(projectId);
        await assignProject(accountWinnerID, projectId);
        messageOfHoldAuction = ("\nThe winner of the auction is : ".green
            + await databaseClass.getAccountUsernameUsingAccountId(accountWinnerID));
    } else {
        messageOfHoldAuction = ("there are no bids on this project! cannot hold auction".red);
    }
    return messageOfHoldAuction;
}


async function createNewAuction(winnerID, projectID) {
    let auctionID = await databaseClass.getNumberOfRowsInAuctionsTable();
    return new auctionClass(auctionID, projectID, winnerID);
}


async function isAuctionDay(projectId) {
    let projectDeadline = await databaseClass.getProjectDeadlineUsingProjectId(projectId);
    let localDate = Date.now();
    return projectDeadline <= localDate;

}

async function findTheBestUserIdBidingOnProject(projectId) {
    let listOfBidIDsForProject = await createListOfBidsForProject(projectId);
    if (listOfBidIDsForProject.length !== 0) {
        return await calculateToFindTheBestBid(listOfBidIDsForProject);

    } else {
        return null;
    }
}

async function calculateToFindTheBestBid(listOfBidIDsForProject) {
    let bestBid = 0;
    let bestUserId;
    for (let i = 0; i < listOfBidIDsForProject.length; i++) {
        let bid = await buildFullBidUsingBidID(i);
        let userSkill = parseInt(await calculateUserSkill(bid));
        if (userSkill > bestBid) {
            bestBid = userSkill;
            bestUserId = bid.userID;
        }
    }
    return bestUserId;
}

async function createListOfBidsForProject(projectID) {
    let listOfBids = await databaseClass.getBidsOfProjectUsingProjectId(projectID);
    return listOfBids;

}

async function calculateUserSkill(bid) {
    let project = await buildFullProjectByGettingID(bid.projectID);
    let account = await buildFullAccountByGettingID(bid.userID);
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

async function assignProject(userID, projectID) {
    await databaseClass.updateProjectAssignedAccountId(projectID, userID);
}


//add/remove
async function addSkill(username, skillName, skillPoint) {
    let accountID = await databaseClass.getAccountIDUsingAccountUsername(username);
    let skillID = await databaseClass.getNumberOfRowsInSkillsTable();
    if (checkIfSkillIsValid(skillName)) {
        await databaseClass.saveAccountSkill(skillID, skillName, skillPoint, accountID);
        return ("skill added successfully!\n".green);
    } else {
        return ("such skill does not exist!".red);
    }
}


function checkIfSkillIsValid(givenSkill) {
    let skillIsValid = false;
    viewClass.allSkills.forEach((skill) => {
        if (skill.name === givenSkill) skillIsValid = true;
    })
    return skillIsValid;
}


async function removeSkill(username, skillName) {
    let accountID = await databaseClass.getAccountIDUsingAccountUsername(username);
    let skillID = await databaseClass.getSkillIdUsingSkillNameAndAccountID(skillName, accountID);
    if (await checkIfAccountHasSkill(accountID, skillID)) {
        await databaseClass.deleteSkillOfAccountUsingSkillName(skillID);
        return ("skill removed successfully!\n".green);

    } else {
        return ("user does not have such skill!".red);
    }
}


async function checkIfAccountHasSkill(accountID, skillID) {
    let hasThisSkill = false;
    let skillsMap = await getAllSkillsMapOfAccount(accountID);
    let skillName = await databaseClass.getSkillNameUsingSkillId(skillID);
    skillsMap.forEach((value, key) => {
        if (key === skillName) {
            hasThisSkill = true;
        }
    })
    return hasThisSkill;

}


//confirm Skill
async function confirmSkill(conformerAccountUsername, targetAccountUsername, skillName) {
    let sourceUserID = await databaseClass.getAccountIDUsingAccountUsername(conformerAccountUsername);
    let otherUserID = await databaseClass.getAccountIDUsingAccountUsername(targetAccountUsername);
    let skillID = await databaseClass.getSkillIdUsingSkillNameAndAccountID(skillName, otherUserID);
    let hasConfirmedBefore = await checkIfConfirmedBefore(sourceUserID, skillID);
    if (!hasConfirmedBefore) {
        await addPointTOSkillForConfirmation(skillID);
        await createNewConfirmation(skillID, sourceUserID);
        return (conformerAccountUsername + " confirmed " + targetAccountUsername + " s ((" + skillName + ")) skill\n ");

    } else return ("cannot confirm this skillSet! you have done it once before!".red);

}

async function addPointTOSkillForConfirmation(skillId) {
    let skillPoint = await databaseClass.getSkillPointUsingSkillId(skillId);
    await databaseClass.updateAccountSkillPoint(skillId, skillPoint + 1);
}

async function createNewConfirmation(skillId, sourceUserId) {
    let confirmationId = await databaseClass.getNumberOfRowsInConfirmationTable();
    await databaseClass.saveConfirmation(confirmationId, skillId, sourceUserId);
}

async function checkIfConfirmedBefore(userSourceID, skillID) {
    let confirmationId = await databaseClass.getConfirmationUsingSkillIdAndAccountId(skillID, userSourceID);
    if (confirmationId === undefined) return false;
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


async function convertSkillsArrayToSkillsMap(arr) {
    let skillMap = new Map();
    for (let i = 0; i < arr.length; i++) {
        let skillID = arr[i].id;
        let skillName = await databaseClass.getSkillNameUsingSkillId(skillID);
        let skillPoint = await databaseClass.getSkillPointUsingSkillId(skillID);
        skillMap.set(skillName, skillPoint);
    }
    return skillMap;
}

//login
async function login(username, password) {
    let accountId = await databaseClass.getAccountIDUsingAccountUsername(username);
    let account = await buildFullAccountByGettingID(accountId);
    if (account.password === password) {
        let token = await generateJWT(username, password);
        await databaseClass.saveLogin(accountId, token);
        return "login successfully! your loginToken : ".green + token;
    } else {
        return "incorrect password! please try again.".red;
    }


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

/******************************************************Token***********************************************************/

async function generateJWT(username, password) {
    let user = {
        username: username,
        password: password
    };

    let tokenCreated = jwt.sign({user: user}, 'secret key', {expiresIn: '1h'});
    return tokenCreated;
}

async function checkIfTokenIsExpired(token) {
    let isExpired = false;
    jwt.verify(token, 'secret key', function (err, decoded) {
            if (err) {
                isExpired = true;
            }

        }
    );
    return isExpired;
}

async function checkTokenValidation(token) {
    let tokenId = await databaseClass.getLoginIdUsingToken(token);
    if ((await checkIfTokenIsExpired(token)) || (tokenId===undefined)) {
        return false;
    }
    else {
        return true;
    }
}

async function validateUserLoginToken(token) {
    if (await checkTokenValidation(token)) {
        return {
            isValid: true,
            message: "\nvalid token:)".green
        };
    } else {
        return {
            isValid: false,
            message: "\ninvalid token! need to login first!".red
        };
    }

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

function serializeAllData() {
    serializeAccounts();
    serializeProjects();
    serializeBides();
    serializeAuctions();
}

/**************************************************Deserialize********************************************************/

function deserializeAllAccounts(arr) {
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
    viewClass.allSkills = JSON.parse(body);
}

module.exports = {
    holdAuction,
    calculateBestBid: findTheBestUserIdBidingOnProject,
    calculateUserSkill,
    checkIfSkilledEnough,
    checkIfBidEnough
};


module.exports = {
    getProjectById,
    getAccountById,
    viewAllAccounts,
    viewAllProjects,
    viewAvailableProjects,
    register,
    addProject,
    addBid,
    holdAuctionsForAllProjects,
    addSkill,
    removeSkill,
    confirmSkill,
    getAllSkillsFromServer,
    holdAuction,
    generateJWT,
    checkIfTokenIsNotExpired: checkIfTokenIsExpired,
    login,
    validateUserLoginToken


}


