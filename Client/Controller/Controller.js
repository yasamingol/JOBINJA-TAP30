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
const databaseClass = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/DAO.js');


/***********************************************MainFunctionsInMenu***************************************************/

async function buildFullBidUsingBidID(bidID) {
    let bid = await databaseClass.getBidById(bidID)
    let userId = bid.userId;
    let projectId = bid.projectId;
    let bidAmount = bid.bidAmount;
    return new bidClass(bidID, userId, projectId, bidAmount);
}




async function getAllSkillsMapOfAccount(accountID) {
    let skillArray = await databaseClass.getAccountSkills(accountID);
    return await convertSkillsArrayToSkillsMap(skillArray);
}



/*****************************************Logical/Computational-Functions*********************************************/

//register


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



async function addBid(biddingUsername, projectTitle, bidAmount) {
    let addBidsFinalMessage;
    let project = await databaseClass.getProjectByProjectTitle(projectTitle)
    let projectId = project.id;
    let accountId = await getAccountIDUsingAccountUsername(biddingUsername);
    let bid = new bidClass(null,accountId,projectId,bidAmount);
    addBidsFinalMessage = await handlingAddBidErrors(bid);
    return addBidsFinalMessage;
}


async function handlingAddBidErrors( bid) {
    let project = await databaseClass.getProjectById(bid.projectID);
    if (!(project.isAvailable)) {
        return "cannot bid! project has already been taken.".red;
    } else if (!(await checkIfSkilledEnough(bid.userID, bid.projectID))) {
        return "cannot bid! not skilled enough.".red;
    } else if (!(await checkIfBidEnough(bid.projectID, bid.bidAmount))) {
        return "cannot bid! bid amount not acceptable".red;
    // } else if (!(await checkIfValidDateToBid(bid.projectID))) {
    //     return "you cannot bid on this project! it has ended".red;
    } else {
        return (await createBid(bid));
    }
}

async function createBid(bid) {
    await databaseClass.saveBid(bid);
    return "bid created successfully!\n".green;

}

async function checkIfBidEnough(projectId, userBidAmount) {
    let project = await databaseClass.getProjectById(projectId);
    let bidIsEnough = false;
    let mainBidAmount = project.budget;
    if (userBidAmount <= mainBidAmount) bidIsEnough = true;
    return bidIsEnough;
}

async function checkIfValidDateToBid(projectId) {
    let project = await databaseClass.getProjectById(projectId);
    let projectDeadline = project.deadline;
    let localDate = Date.now();
    return parseInt(projectDeadline) >= parseInt(localDate/10000000000);

}



//holdAuctions
async function holdAuctionsForAllProjects() {
    let numberOfProjects = await databaseClass.getNumberOfAllProjects();
    for (let i = 1; i <= numberOfProjects; i++) {
        let projectID = i;
        if (await isAuctionDay(projectID)) {
            await holdAuction(projectID);
        }
    }
}

async function holdAuction(projectId) {
    let messageOfHoldAuction = "";
    let project = await databaseClass.getProjectById(projectId);
    if (!(project.isAvailable)) {
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
        let auction = new auctionClass(null,accountWinnerID,projectId)
         await databaseClass.saveAuction(auction);
        await databaseClass.updateProjectAvailability(projectId);
        await assignProject(accountWinnerID, projectId);
        messageOfHoldAuction = ("\nThe winner of the auction is : ".green
            + await getAccountUsernameUsingAccountId(accountWinnerID));
    } else {
        messageOfHoldAuction = ("there are no bids on this project! cannot hold auction".red);
    }
    return messageOfHoldAuction;
}


async function createNewAuction(auction) {
    return new auctionClass(auction);
}


async function isAuctionDay(projectId) {
    let project  = await databaseClass.getProjectById(projectId);
    let projectDeadline = project.deadline
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
        let bidId = listOfBidIDsForProject[i].id
        let bid = await this.buildFullBidUsingBidID(bidId);
        let userSkill = parseInt(await this.calculateUserSkill(bid));
        if (userSkill > bestBid) {
            bestBid = userSkill;
            bestUserId = bid.userID;
        }
    }
    return bestUserId;
}



async function calculateUserSkill(bid) {
    let project = await this.buildFullProjectByGettingID(bid.projectID);
    let account = await this.buildFullAccountByGettingID(bid.userID);
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


//add/remove
async function addSkill(username, skillName, skillPoint) {
    let accountID = await getAccountIDUsingAccountUsername(username);
    if (checkIfSkillIsValid(skillName)) {
        await databaseClass.saveAccountSkill(skillName, skillPoint, accountID);
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
    let accountID = await getAccountIDUsingAccountUsername(username);
    let skill = await databaseClass.getSkillIdUsingSkillNameAndAccountID(skillName, accountID);
    let skillID = skill.id;
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
    let skill = await databaseClass.getSkillById(skillID);
    let skillName = skill.skillName;
    skillsMap.forEach((value, key) => {
        if (key === skillName) {
            hasThisSkill = true;
        }
    })
    return hasThisSkill;

}


//confirm Skill
async function confirmSkill(conformerAccountUsername, targetAccountUsername, skillName) {
    let sourceUserID = parseInt(await getAccountIDUsingAccountUsername(conformerAccountUsername));
    let otherUserID = parseInt(await getAccountIDUsingAccountUsername(targetAccountUsername));
    let skill = await databaseClass.getSkillIdUsingSkillNameAndAccountID(skillName, otherUserID);
    let skillID = skill.id
    let hasConfirmedBefore = await checkIfConfirmedBefore(sourceUserID, skillID);
    if (!hasConfirmedBefore) {
        await addPointTOSkillForConfirmation(skillID);
        await createNewConfirmation(skillID, sourceUserID);
        return (conformerAccountUsername + " confirmed " + targetAccountUsername + " s ((" + skillName + ")) skill\n ");

    } else return ("cannot confirm this skillSet! you have done it once before!".red);

}

async function addPointTOSkillForConfirmation(skillId) {
    let skill = await databaseClass.getSkillById(skillId);
    let skillPoint = skill.skillPoint;
    await databaseClass.updateAccountSkillPoint(skillId, skillPoint + 1);
}

async function createNewConfirmation(skillId, sourceUserId) {
    await databaseClass.saveConfirmation(skillId, sourceUserId);

}

async function checkIfConfirmedBefore(userSourceID, skillID) {
    let confirmationId = await databaseClass.getConfirmationUsingSkillIdAndAccountId(skillID, userSourceID);
    if (confirmationId === undefined  || confirmationId.length === 0) return false;
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
        let skill = await databaseClass.getSkillById(skillID)
        let skillName = skill.skillName;
        let skillPoint = skill.skillPoint;
        skillMap.set(skillName, skillPoint);
    }
    return skillMap;
}



//login


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

/**********************************************PythonServer-Methods*********************************************/
async function sendLoginInfoAndReciveTokenFromServer(username,password) {
    try {
        const response = await axios.post('http://localhost:5001/login', {
            username: username,
            password: password
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}
async function validateTokenFromServer(token){

    try {
        const response = await axios.post('http://localhost:5001/validateToken', {
            token: token
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}
async function saveAccount(username,password){
    try {
        const response = await axios.post('http://localhost:5001/saveAccount', {
            username: username,
            password:password
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}
async function getAccountsFullDBTable(){
    try {
        const response = await axios.post('http://localhost:5001/getAccountsFullDBTable', {
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}
async function getFullAccountById(accountId){
    try {
        const response = await axios.post('http://localhost:5001/getFullAccountById', {
            id:accountId
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}
async function getAccountUsernameUsingAccountId(accountId){
    try {
        const response = await axios.post('http://localhost:5001/getAccountUsernameUsingAccountId', {
            id:accountId
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}
async function getAccountPasswordUsingAccountId(accountId){
    try {
        const response = await axios.post('http://localhost:5001/getAccountPasswordUsingAccountId', {
            id:accountId
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}
async function getAccountIDUsingAccountUsername(username){
    try {
        const response = await axios.post('http://localhost:5001/getAccountIDUsingAccountUsername', {
            username:username
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}
async function getNumberOfRowsOfAccountsTable(){
    try {
        const response = await axios.post('http://localhost:5001/getNumberOfRowsOfAccountsTable', {
        });
        return response.data;

    } catch (e) {
        console.log(e)
    }
}

/**********************************************Calling-API_Server-Methods*********************************************/

async function getAllSkillsFromServer(request) {
    const promisifiedRequest = util.promisify(request);
    const {error, response, body} = await promisifiedRequest('http://localhost:5000/api/skills');
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    deserializeAllSkills(body);

}

function deserializeAllSkills(body) {
    viewClass.allSkills = JSON.parse(body);
}





module.exports = {
    viewAllAccounts,
    viewAvailableProjects: viewAvailableProjectsForAccount,
    register,
    addBid,
    addSkill,
    removeSkill,
    confirmSkill,
    holdAuction,
    login,
    validateTokenFromServer,
    saveAccount,
    holdAuction,
    calculateBestBid: findTheBestUserIdBidingOnProject,
    calculateUserSkill,
    checkIfSkilledEnough,
    checkIfBidEnough,
    buildFullBidUsingBidID,
    calculateToFindTheBestBid,
    convertSkillsArrayToSkillsMap,
    stringToDateConverter,
    buildSkillsMap,
    projectClass,
    getAllSkillsMapOfAccount,
    getFullAccountById,
    getAccountIDUsingAccountUsername,
    getNumberOfRowsOfAccountsTable,
    getAccountUsernameUsingAccountId,
    sendLoginInfoAndReciveTokenFromServer



}


