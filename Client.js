/****************************************************Preperation******************************************************/
//importing classes
const accountClass = require("./Account");
const projectClass = require("./Project");
const bidClass = require("./Bid");
const auctionClass = require("./Auction");
const util = require('util')
let allSkills = [];


//using API to get DATA
const request = require('request');
(async () => {
    await getAllProjects(request);
    await getAllSkills(request);
    await getAllAccounts(request);
    loadMenus();



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
        holdAuctions();


        //Menus
        let arr = [];
        console.log("\n MENUS : ".cyan + "\n 1.view all projects \n 2.view available projects \n 3.view project by id " +
            "\n 4.view all accounts \n 5.view account by id \n 6.bid on a project " +
            "\n 7.confirmSkills \n 8.addSkill \n 9.removeSkill \n 10.register \n 11.login" +
            " \n 12.exit \n Please enter the menu number you want to enter : ");
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
            await getProjectById(command);

        } else if (selectedMenu === "4") {
            console.log("\nView all accounts menu".cyan);


        } else if (selectedMenu === "5") {
            console.log("Welcome to ((view account)) menu!".cyan + "command : <account-id>".green);
            command = prompt("");
            await getAccountByID(command);

        } else if (selectedMenu === "6") {

        } else if (selectedMenu === "7") {

        } else if (selectedMenu === "8") {

        } else if (selectedMenu === "9") {

        } else if (selectedMenu === "10") {

        } else if (selectedMenu === "11") {

        } else if (selectedMenu === "12") {
            console.log("exit");
            commandIsValid = true;
        } else console.log("command is invalid! try again".red);


    }

//serializing
    serializeAccounts();
    serializeProjects();
    serializeBides();
    serializeAuctions();


}

/***********************************************Main-Functions*********************************************************/
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

/***********************************************API-Client-Methods**************************************************/

async function getAllProjects(request) {
    const promisifiedRequest = util.promisify(request);
    const {error, response, body} = await promisifiedRequest('http://localhost:3000/api/projects');
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    deserializeAllProjects(JSON.parse(body));
    console.log(projectClass.allProjects);
}

async function getAllSkills(request) {
    const promisifiedRequest = util.promisify(request);
    const {error, response, body} = await promisifiedRequest('http://localhost:3000/api/skills');
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    deserializeAllSkills(body);
    console.log(allSkills);

}

async function getAllAccounts(request) {
    const promisifiedRequest = util.promisify(request);
    const {error, response, body} = await promisifiedRequest('http://localhost:3000/api/accounts');
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    deserializeAllAccounts(JSON.parse(body));
    console.log(accountClass.allAccounts);

}

async function getProjectById(id) {
    const promisifiedRequest = util.promisify(request);
    const {error, response, body} = await promisifiedRequest('http://localhost:3000/api/projects/' + id);
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log(JSON.parse(body));
}

async function getAccountByID(id) {
    const promisifiedRequest = util.promisify(request);
    const {error, response, body} = await promisifiedRequest('http://localhost:3000/api/accounts/' + id);
    console.error('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log(JSON.parse(body));

}

/***********************************************OldMenu-Functions*****************************************************/
function register(arr) {
    let username = arr[1];
    let skills = new Map;
    let skillConfirmationList = new Map;
    for (let i = 2; i < arr.length; i++) {
        let arrSkiles = [];
        arrSkiles = arr[i].split(":");
        skills.set(arrSkiles[0], arrSkiles[1]);

    }
    new accountClass(username, skills, [], skillConfirmationList);
    console.log("registered successfully!\n".red);

}


function addProject(arr) {
    let title = arr[1];
    let skills = new Map;
    let budget = arr[arr.length - 2];
    let deadline = stringToDateConverter(arr[arr.length - 1]);

    for (let i = 2; i < arr.length - 2; i++) {
        let arrSkiles = [];
        arrSkiles = arr[i].split(":");
        skills.set(arrSkiles[0], arrSkiles[1]);
    }
    new projectClass(title, skills, budget, [], deadline, true);
    console.log("project built successfully!\n".red);
}


function addBid(arr) {
    let biddingUser = arr[1];
    let projectTitle = arr[2];
    let bidAmount = arr[3];
    if (!projectClass.getProjectByTitle(projectTitle).isAvailable) {
        console.log("cannot bid! project has already been taken.".red);
    } else if (!checkIfSkilledEnough(biddingUser, projectTitle)) {
        console.log("cannot bid! not skilled enough.".red);
    } else if (!checkIfBidEnough(projectTitle, bidAmount)) {
        console.log("cannot bid! bid amount not acceptable".red);
    } else if (!checkIfValidDateToBid(projectTitle)) {
        console.log("you cannot bid on this project! it has ended".red);
    } else {
        let bid = new bidClass(biddingUser, projectTitle, bidAmount);
        projectClass.getProjectByTitle(projectTitle).listOfBids.push(bid);
        console.log("bid created successfully!\n".red);
    }
}

function holdAuctions() {
    projectClass.allProjects.forEach((project) => {
        let projectName = project.title;
        if (isAuctionDate(projectName)) {
            holdAuction(projectName);
        }
    })
}

function holdAuction(projectName) {
    let projectTitle = projectClass.getProjectByTitle(projectName);
    let accountWinner = calculateBestBid(projectTitle);
    new auctionClass(projectTitle, accountWinner);
    projectClass.getProjectByTitle(projectTitle).isAvailable = false;
    assignProject(accountWinner, projectTitle);
    console.log("\nThe winner of the auction is : ".red + accountWinner.red);
}


function isAuctionDate(projectName) {
    let projectDeadline = projectClass.getProjectByTitle(projectName).deadline;
    let localDate = Date.now();
    return projectDeadline <= localDate;

}

function addSkill(arr) {
    let account = accountClass.getAccountByUsername(arr[1]);
    let arrSkiles = [];
    arrSkiles = arr[2].split(":");
    account.skills.set(arrSkiles[0], arrSkiles[1]);
    console.log("skill added successfully!\n".red);
}

function removeSkill(arr) {
    let account = accountClass.getAccountByUsername(arr[1]);
    let skillName = arr[2];
    account.skills.delete(skillName);
    console.log("skill removed successfully!\n".red);
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
        console.log(arr[1] + " confirmed ".red + arr[2] + " s ((".red + arr[3] + ")) skill\n ".red);
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


function assignProject(username, projectName) {
    let account = accountClass.getAccountByUsername(username);
    account.asignedProjectList.push(projectName);
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
    let projectDeadline = projectClass.getProjectByTitle(projectName).deadline;
    let localDate = Date.now();
    return projectDeadline >= localDate;

}

function stringToDateConverter(string) {
    let arr = string.split("/");
    let date = new Date(arr[0], arr[1], arr[2], 0, 0, 0);
    console.log(date);
    return date;
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

function calculateBestBid(projectTitle) {
    let bestBid = 0;
    let bestBidsAccount;
    let project = projectClass.getProjectByTitle(projectTitle);
    project.listOfBids.forEach((bid) => {
        let userSkill = parseInt(calculateUserSkill(bid));
        if (userSkill > bestBid) {
            bestBid = userSkill;
            bestBidsAccount = accountClass.getAccountByUsername(bid.username);
        }
    });
    return bestBidsAccount.username;
}

/***********************************************Tool-Functions*********************************************************/

function getMapSize(x) {
    let len = 0;
    for (let count in x) {
        len++;
    }

    return len;
}

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
        const myJson = {};
        myJson.id = account.id;
        myJson.username = account.username;
        myJson.skills = mapToObj(account.skills);
        myJson.asignedProjectList = account.asignedProjectList;
        myJson.skillConfirmationList = mapToObj(account.skillConfirmationList);
        const json = JSON.stringify(myJson);
        serialize("./DataBase/Accounts/allAccounts" + "_" + i, json);


    }
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
        serialize("./DataBase/Projects/allProjects" + "_" + i, json);

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
        serialize("./DataBase/Bids/allBids" + "_" + i, json);


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
        serialize("./DataBase/Auction/allAuctions" + "_" + i, json);


    }

}

/***********************************************Deserialize**************************************************/

function deserializeAllAccounts(arr) {
    // username, skills,asignedProjectList,skillConfirmationList
    for (let i = 0; i < arr.length; i++) {
        let id = arr[i].id;
        let username = arr[i].username;
        let skillsArr = objToMap(arr[i].skills);
        let asignedProjectList = arr[i].asignedProjectList;
        let skillConfirmationList = arr[i].skillConfirmationList;
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