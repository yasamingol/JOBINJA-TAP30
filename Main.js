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
    let account = getAccountByUsername(username);
    let project = getProjectByTitle(jobname);
    for (let i = 0; i < getMapSize(account.skills); i++) {

    }

}

function calculateBestBid() {


}

function getMapSize(x) {
    let len = 0;
    for (let count in x) {
        len++;
    }

    return len;
}

function serialize(element,name){
    const fs = require('fs');
    const jsonContent = JSON.stringify(element);

    fs.appendFile(name+".json", jsonContent, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });

}

function serializeALLElements(arr,name){
    for(let i=0; i<arr.length; i++){
        serialize(arr[i],name+"_"+i);
    }

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
        console.log("\nWelcome to Register_Menu! You can create a new account using : register <user_info> ");
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
        arr = command.split(" ");4
        let biddingUser = arr[1];
        let projectTitle = arr[2];
        let bidAmount = arr[3];
        new Bid(biddingUser, projectTitle, bidAmount);
        console.log("bid created successfully!\n");

    } else if (selectedMenu === "4") {
        console.log("welcome to  auction menu!\nyou can end auction using : auction <project_identifier>");

    } else if (selectedMenu === "5") {
        console.log("exit");
        commandIsValid = true;
    } else console.log("command is invalid! try again")


}

//serializing
serializeALLElements(allAccounts,"./DataBase/Accounts/allAccounts");
serializeALLElements(allProjects,"./DataBase/Projects/allProjects");
serializeALLElements(allBids,"./DataBase/Bids/allBids");



// console.log(allProjects);
// console.log(allAccounts);
// console.log(allBids);



