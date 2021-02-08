/****************************************************Preperation******************************************************/
//importing classes
const accountClass = require("./Account");
const projectClass = require("./Project");
const bidClass = require("./Bid");
const auctionClass = require("./Auction");


//reading all commands form file
let allCommands = [];
let counter = -1;
const fs = require('fs');
let content;
readFromFile("/home/tapsi/IdeaProjects/concurency/testCases");
allCommands = content.split("\n");


//deserializing

/****************************************************Main-MENUS************************************************************/
const prompt = require('prompt-sync')();
const colors = require('colors');
console.log("Welcome to JobInja!".red)

let commandIsValid = false;
while (!commandIsValid) {
    let arr = [];
    console.log(" MENUS : ".cyan + "\n 1.register \n 2.login \n 3.addProjecct \n 4.bid \n 5.auction \n 6.addSkill \n 7.removeSkill \n 8.confirmSkills \n 9.exit \n Please enter the menu number you want to enter : ");
    // const selectedMenu = readOneLine();
    const selectedMenu = prompt("");


    if (selectedMenu === "1") {
        console.log("\nWelcome to register menu! You can create a new account using : " + "register <username> <skill:rate> ".green);
        // const command = readOneLine();
        const command = prompt("");
        arr = command.split(" ");
        register(arr);


    } else if (selectedMenu === "2") {
        console.log("\nWelcome to login menu! You log into your accout : " + "register <username> <skill:rate> ".green);


    } else if (selectedMenu === "3") {
        console.log("\nwelcome to  addProject menu!\nyou can add a new project using : " + "addProject <projectTitle> <skill:rate> <budget> <deadline(year/month/day)>".green);
        // const command = readOneLine();
        const command = prompt("");
        arr = command.split(" ");
        addProject(arr);


    } else if (selectedMenu === "4") {
        console.log("\nwelcome to  bid menu!\nyou can add a new bid using : " + "bid <username> <projectTitle> <bidAmount>".green);
        // const command = readOneLine();
        const command = prompt("");
        arr = command.split(" ");
        addBid(arr);


    } else if (selectedMenu === "5") {
        console.log("\nwelcome to  auction menu!\nyou can end auction using : " + "auction <username> <projectTitle>".green);
        // const command = readOneLine();
        const command = prompt("");
        arr = command.split(" ");
        holdAuction(arr);


    } else if (selectedMenu === "6") {
        console.log("\nwelcome to addSkill menu!\nyou can add a skill using" + "addSkill <username> <skill:rate>".green);
        const command = prompt("");
        arr = command.split(" ");
        addSkill(arr);



    } else if (selectedMenu === "7") {
        console.log("\nwelcome to removeSkill menu!\nyou can remove a skill using" + "removeSkill <username> <skill>".green);
        const command = prompt("");
        arr = command.split(" ");
        removeSkill(arr);


    } else if (selectedMenu === "8") {
        console.log("\nwelcome to confirmSkill menu!\nyou can confirm a skill using" + "removeSkill <your_username> <other_username> <skill:rate>".green);
        const command = prompt("");
        arr = command.split(" ");


    } else if (selectedMenu === "9") {
        console.log("exit");
        commandIsValid = true;
    } else console.log("command is invalid! try again".red);


}

//serializing
serializeAccounts();
serializeProjects();
serializeBides();
serializeAuctions();


/***********************************************Main-Functions*********************************************************/
function register(arr) {
    let username = arr[1];
    let skills = new Map;
    for (let i = 2; i < arr.length; i++) {
        let arrSkiles = [];
        arrSkiles = arr[i].split(":");
        skills.set(arrSkiles[0], arrSkiles[1]);

    }
    new accountClass(username, skills, []);
    console.log("registered successfully!\n".red);

}

//addProject <projectTitle> <skill:rate> <budget> <deadline(year/month/day)>
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
    } else if (!checkIfValidDate(projectTitle)) {
        console.log("you cannot bid on this project! it has ended".red);
    } else {
        let bid = new bidClass(biddingUser, projectTitle, bidAmount);
        projectClass.getProjectByTitle(projectTitle).listOfBids.push(bid);
        console.log("bid created successfully!\n".red);
    }
}


function holdAuction(arr) {
    let projectTitle = arr[1];
    let accountWinner = calculateBestBid(projectTitle);
    new auctionClass(projectTitle, accountWinner);
    projectClass.getProjectByTitle(projectTitle).isAvailable = false;
    assignProject(accountWinner, projectTitle);
    console.log("\nThe winner of the auction is : ".red + accountWinner.red);
}

function addSkill(arr){
    let account = accountClass.getAccountByUsername(arr[1]);
    let arrSkiles = [];
    arrSkiles = arr[2].split(":");
    account.skills.set(arrSkiles[0], arrSkiles[1]);
    console.log("skill added successfully!\n".red);
}

function removeSkill(arr){
    let account = accountClass.getAccountByUsername(arr[1]);
    let skillName = arr[2];
    account.skills.delete(skillName);
    console.log("skill removed successfully!\n".red);
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

function checkIfBidEnough(projectName, userBidAmount) {
    let mainBidAmount = projectClass.getProjectByTitle(projectName).budget;
    if (parseInt(userBidAmount) <= parseInt(mainBidAmount)) return true;
    else return false;
}

function checkIfValidDate(projectName) {
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

function readFromFile(address) {
    try {
        content = fs.readFileSync(address, {encoding: 'utf8'});
    } catch (err) {
        // An error occurred
        console.error(err);
    }
}

function readOneLine() {
    counter++;
    return allCommands[counter];
}

/***********************************************Serialize/Deserialize**************************************************/

function serialize(name, jsonContent) {
    const fs = require('fs');
    fs.appendFile(name + ".json", jsonContent, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!".red);
    });

}

function serializeAccounts() {
    for (let i = 0; i < accountClass.allAccounts.length; i++) {
        let account = accountClass.allAccounts[i];
        const myJson = {};
        myJson.username = account.username;
        myJson.skills = mapToObj(account.skills);
        myJson.asignedProjectList = account.asignedProjectList;
        const json = JSON.stringify(myJson);
        serialize("./DataBase/Accounts/allAccounts" + "_" + i, json);


    }
}

function serializeProjects() {
    for (let i = 0; i < projectClass.allProjects.length; i++) {
        let project = projectClass.allProjects[i];
        const myJson = {};
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
        myJson.projecTitle = auction.projectTitle;
        myJson.usernameWinner = auction.accuntWinner;
        const json = JSON.stringify(myJson);
        serialize("./DataBase/Auction/allAuctions" + "_" + i, json);


    }

}

function deserialize(arr) {

}

function deserializeAllAccounts() {
}
