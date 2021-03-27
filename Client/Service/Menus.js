/****************************************************requirements******************************************************/
const prompt = require('prompt-sync')();
const colors = require('colors');
const Account = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Account.js');
const Auction = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Auction.js');
const Bid = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Bid.js');
const Project = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Project.js');
const Skill = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Skill.js');
const SkillConfirmation = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/SKillConfirmation.js');
const toolFunctions = require('/home/tapsi/IdeaProjects/concurency/Client/Business/ToolFunctions.js');
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');


/****************************************************Main-Menus********************************************************/
async function loadMenus() {

    console.log("Welcome to JobInja!".red)
    while (true) {

        //Menus
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
            let registrationMessage = await loadRegisterMenu();
            console.log(registrationMessage);


        } else if (selectedMenu === "11") {
            await loadAddProjectMenu();


        } else if (selectedMenu === "12") {
            await loadHoldAuctionMenu();


        } else if (selectedMenu === "13") {
            let loginMessage = await loadLoginMenu();
            console.log(loginMessage);

        } else if (selectedMenu === "14") {
            console.log("exit");
            break;

        } else console.log("command is invalid! try again".red);

    }


}

/****************************************************MainFunctions*****************************************************/

function showAvailableMenus() {
    console.log(Messages.AvailableMenus)
}


async function loadAllProjectsMenu() {
    console.log("\n View all projects menu : ".cyan + "<token>".green);
    let token = prompt("");

    if (!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))) {
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

    if (!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))) {
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

    if (!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        console.log(await Project.getProjectById(projectId));
    }
}


async function loadViewAllAccountsMenu() {
    console.log("\nView all accounts menu".cyan + "<token>".green);
    let token = prompt("");

    if (!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))) {
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

    if (!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))) {
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

    if (!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))) {
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

    if (!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        console.log(await SkillConfirmation.confirmSkill(conformerAccountUsername, targetAccountUsername, skillName));
    }
}


async function loadAddSkillMenu() {
    console.log("\nwelcome to addSkill menu!\nyou can add a skill using" + "addSkill <username> <skill:rate> <token>".green);
    const inputArr = prompt("").split(" ");
    let username = inputArr[1];
    let token = inputArr[3];

    if (!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))) {
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

    if (!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        console.log(await Skill.removeSkill(username, skillName));
    }
}


async function loadRegisterMenu() {
    let registerRequirements = prepareRegistrationRequirements();
    let {skills, buildSkillMessage} = Skill.buildSkillsMap(registerRequirements.skillsArr);
    let account = new Account(registerRequirements.username, registerRequirements.password, skills);
    let registerMessage = await account.register();

    return {
        buildSkillMessage: buildSkillMessage,
        registerMessage: registerMessage
    }

}


function prepareRegistrationRequirements() {
    console.log(Messages.WelcomeToRegisterMenu);
    let inputArr = prompt("").split(" ");
    let username = inputArr[1];
    let password = inputArr[2];
    let skillsArr = inputArr.slice(3, inputArr.length);

    return {
        username: username,
        password: password,
        skillsArr: skillsArr
    }

}


async function loadLoginMenu() {
    let loginRequirements = await prepareLoginRequirements();
    let loginMessage = await Account.login(loginRequirements.username, loginRequirements.password);
    return loginMessage;
}


async function prepareLoginRequirements() {
    console.log(Messages.WelcomeToLoginMenu);
    let inputArr = prompt("").split(" ");
    let username = inputArr[1];
    let password = inputArr[2];
    return {
        username: username,
        password: password
    }

}


async function loadAddProjectMenu() {

    let addProjectRequirements = prepareAddProjectRequitments();

    let {skills, messagesOfBuildSkillMap} = Skill.buildSkillsMap(addProjectRequirements.skillsArr);
    let project = new Project(addProjectRequirements.title, skills, addProjectRequirements.budget,
                                addProjectRequirements.deadline, addProjectRequirements.isAvailable);

    if (!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(addProjectRequirements.token))) {
        let addProjectMessage = await project.addProject();

        return {
            addProjectMessage: addProjectMessage,
            messagesOfBuildSkillMap:messagesOfBuildSkillMap
        }
    }

}


async function prepareAddProjectRequitments() {
    console.log(Messages.WelcomeToAddProjectMenu);
    let inputArr = prompt("").split(" ");
    let title = inputArr[1];
    let budget = inputArr[inputArr.length - 3];
    let deadLine = toolFunctions.stringToDateConverter(inputArr[inputArr.length - 2]);
    let skillsArr = inputArr.slice(2, inputArr.length - 3);
    let token = inputArr[inputArr.length - 1]

    return {
        title: title,
        budget: budget,
        deadLine: deadLine,
        skillsArr: skillsArr,
        isAvailable: true,
        token: token

    }
}


async function loadHoldAuctionMenu() {
    console.log("\nwelcome to  Auction menu!\nyou can hold an Auction for a project: "
        + "holdAuction <projectId> <token>".green);
    let inputArr = prompt("").split(" ");
    let projectId = parseInt(inputArr[1]);
    let token = inputArr[2];

    if (!(await toolFunctions.checkIfAnyErrorsApearedDuringTokenValidation(token))) {
        console.log(await Auction.holdAuction(projectId));
    }

}


module.exports = {
    loadMenus

}


