/****************************************************requirements******************************************************/
const prompt = require('prompt-sync')();
const colors = require('colors');
const Account  = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Account.js');
const Auction = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Auction.js');
const Bid = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Bid.js');
const Project = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Project.js');
const Skill = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Skill.js');
const SkillConfirmation = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/SKillConfirmation.js');
const toolFunctions = require('/home/tapsi/IdeaProjects/concurency/Client/Business/ToolFunctions.js');



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

    if(!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))){
        let projectsArray = await Project.viewAllProjects();
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

    if(!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        console.log("\n Available projects : ".green);
        let availableProjectsArr = await Account.viewAvailableProjectsForAccount(username);
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

    if(!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        console.log(await Project.getProjectById(projectId));
    }
}


async function loadViewAllAccountsMenu() {
    console.log("\nView all accounts menu".cyan + "<token>".green);
    let token = prompt("");

    if(!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        let allAccountsArr = await Account.viewAllAccounts();
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

    if(!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        console.log(await Account.getAccountById(accountId));
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

    if(!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        console.log(await Bid.addBid(biddingUsername, projectTitle, bidAmount));
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

    if(!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        console.log(await SkillConfirmation.confirmSkill(conformerAccountUsername, targetAccountUsername, skillName));
    }
}


async function loadAddSkillMenu() {
    console.log("\nwelcome to addSkill menu!\nyou can add a skill using" + "addSkill <username> <skill:rate> <token>".green);
    const inputArr = prompt("").split(" ");
    let username = inputArr[1];
    let token = inputArr[3];

    if(!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        let arrSkills = inputArr[2].split(":");
        let skillName = arrSkills[0];
        let skillPoint = arrSkills[1];
        console.log(await Skill.addSkill(username, skillName, parseInt(skillPoint)));
    }
}


async function loadRemoveSkillMenu() {
    console.log("\nwelcome to removeSkill menu!\nyou can remove a skill using"
        + "removeSkill <username> <skill> <token>".green);
    const inputArr = prompt("").split(" ");
    let username = inputArr[1];
    let skillName = inputArr[2];
    let token = inputArr[3];

    if(!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        console.log(await Skill.removeSkill(username, skillName));
    }
}


async function loadRegisterMenu() {
    console.log("Welcome to ((register)) menu!".cyan + "command : register <username> <password> <skill:point>".green);
    let inputArr = prompt("").split(" ");
    let username = inputArr[1];
    let password = inputArr[2];
    let skillsArr = inputArr.slice(3,inputArr.length);
    let registerMessagesArr = await Account.register(username,skillsArr,password);
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

    if(!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        let addProjectArr = await Project.addProject(title, budget, deadLine, skillsArr);
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

    if(!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        console.log(await Auction.holdAuction(projectId));
    }

}
async function loadLoginMenu(){
    console.log("\nwelcome to Login menu!\n you can login: "+"login <username> <password>".green);
    let inputArr = prompt("").split(" ");
    let username = inputArr[1];
    let password = inputArr[2];
    console.log(await Account.login(username,password));
}




module.exports = {
    loadMenus

}


