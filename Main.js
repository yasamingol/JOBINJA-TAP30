/**********************************************Classes************************************************************/
//need to convert this to a static field for account class
let allAccounts = [];
let allProjects = [];
let allBids = [];

//account
class Account {
    constructor(username, skills) {
        this.username = username;
        this.skills = skills;
        allAccounts[allAccounts.length] = this;

    }
}

function getAccountByUsername(username) {
    for (let i = 0; i < allAccounts.length; i++) {
        if (allAccounts[i].username === username) {
            return allAccounts[i];
        }
    }
    console.log("this user does not exist");
}

//PROJECT
class Project {
    constructor(title, skills, budget) {
        this.title = title;
        this.skills = skills;
        this.budget = budget;
        allProjects[allProjects.length] = this;
    }
}

function getProjectByTitle(title) {
    for (let i = 0; i < allProjects.length; i++) {
        if (allProjects[i].title === title) {
            return allProjects[i];
        }
    }
    console.log("this project does not exist");
}

//BID
class Bid {
    constructor(username, projectTitle, bidAmount) {
        this.username = username;
        this.projectaTitle = projectTitle;
        this.bidAmount = bidAmount;
        allBids[allBids.length] = this;
    }
}

/***********************************************Functions*********************************************************/
function calculateUserSkill(username, jobname) {
}

function calculateBestBid() {
}

function checkIfSkilledEnough(userName, projectName) {
    let isSkilled = true;
    let account = getAccountByUsername(userName);
    let project = getProjectByTitle(projectName);
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
    let mainBidAmount = getProjectByTitle(projectName).bidAmount;
    if (parseInt(userBidAmount) <= parseInt(mainBidAmount)) return true;
    else return false;


}

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

/***********************************************Serialize/Deserialize**************************************************/

function serialize(name, jsonContent) {
    const fs = require('fs');
    fs.appendFile(name + ".json", jsonContent, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });

}

function serializeAccounts() {
    for (let i = 0; i < allAccounts.length; i++) {
        let account = allAccounts[i];
        const myJson = {};
        myJson.username = account.username;
        myJson.skills = mapToObj(account.skills);
        const json = JSON.stringify(myJson);
        serialize("./DataBase/Accounts/allAccounts" + "_" + i, json);


    }
}

function serializeProjects() {
    for (let i = 0; i < allProjects.length; i++) {
        let project = allProjects[i];
        const myJson = {};
        myJson.title = project.title;
        myJson.skills = mapToObj(project.skills);
        myJson.budget = project.budget;
        const json = JSON.stringify(myJson);
        serialize("./DataBase/Projects/allProjects" + "_" + i, json);

    }
}

function serializeBides() {
    for (let i = 0; i < allBids.length; i++) {
        let bid = allBids[i];
        const myJson = {};
        myJson.username = bid.username;
        myJson.projectaTitle = bid.projectaTitle;
        myJson.bidAmount = bid.bidAmount;
        const json = JSON.stringify(myJson);
        serialize("./DataBase/Bids/allBids" + "_" + i, json);


    }
}

function deserialize() {
}

function deserializeAllElements() {
}

/***********************************************Menus*************************************************************/

const prompt = require('prompt-sync')();
console.log("Welcome to JobInja!")

let commandIsValid = false;
while (!commandIsValid) {
    console.log(" MENUS : \n 1.register \n 2.addProjecct \n 3.bid \n 4.auction \n 5.exit");
    const selectedMenu = prompt("Please enter the menu number you want to enter : ");

    if (selectedMenu === "1") {
        let arr = [];
        console.log("\nWelcome to register menu! You can create a new account using : register <user_info> ");
        const command = prompt("");
        arr = command.split(" ");
        let username = arr[1];
        let skills = new Map;

        for (let i = 2; i < arr.length; i++) {
            let arrSkiles = [];
            arrSkiles = arr[i].split(":");
            skills.set(arrSkiles[0], arrSkiles[1]);

        }
        new Account(username, skills);
        console.log("registered successfully!\n");


    } else if (selectedMenu === "2") {
        let arr = [];
        console.log("welcome to  addProject menu!\nyou can add a new project using : addProject <project_info>");
        const command = prompt("");
        arr = command.split(" ");
        let title = arr[1];
        let skills = new Map;
        let budget = arr[arr.length - 1];

        for (let i = 2; i < arr.length - 1; i++) {
            let arrSkiles = [];
            arrSkiles = arr[i].split(":");
            skills.set(arrSkiles[0], arrSkiles[1]);
        }
        new Project(title, skills, budget);
        console.log("project built successfully!\n");


    } else if (selectedMenu === "3") {
        let arr = [];
        console.log("welcome to  bid menu!\nyou can add a new bid using : bid <bid_info>");
        const command = prompt("");
        arr = command.split(" ");
        let biddingUser = arr[1];
        let projectTitle = arr[2];
        let bidAmount = arr[3];
        if (checkIfSkilledEnough(biddingUser, projectTitle) && checkIfBidEnough(projectTitle, bidAmount)) {
            new Bid(biddingUser, projectTitle, bidAmount);
            console.log("bid created successfully!\n");
        } else {
            console.log("cannot bid! not skilled enough.");
        }


    } else if (selectedMenu === "4") {
        console.log("welcome to  auction menu!\nyou can end auction using : auction <project_identifier>");

    } else if (selectedMenu === "5") {
        console.log("exit");
        commandIsValid = true;
    } else console.log("command is invalid! try again")


}

//serializing
serializeAccounts();
serializeProjects();
serializeBides();


