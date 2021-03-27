const requestsToPyServer = require('/home/tapsi/IdeaProjects/concurency/Client/Business/RequestsToPyServer.js');
const Skill = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Skill.js');
const Project = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Project.js');
const projectDAO = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Project.js');
const skillDAO = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Skill.js');
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');


class Account {
    _id;
    _assignedProjectList;
    _skillConfirmationList;
    static allAccounts = [];


    constructor(username, password, skills) {
        this.username = username;
        this.password = password;
        this.skills = skills;
        Account.allAccounts[Account.allAccounts.length] = this;
    }


    set id(value) {
        this._id = value;
    }

    set assignedProjectList(value) {
        this._assignedProjectList = value;
    }

    set skillConfirmationList(value) {
        this._skillConfirmationList = value;
    }





    static async getAccountById(id) {
        let account = await Account.buildFullAccountByGettingID(id);
        return account;

    }


    static async buildFullAccountByGettingID(id) {
        let accountFullString = await requestsToPyServer.getFullAccountById(id);
        let inputArr = accountFullString.split("/")
        let username = inputArr[0]
        let password = inputArr[1]
        let skills = await Account.getAllSkillsMapOfAccount(id);
        let assignedProjectList = await projectDAO.getAllProjectsAssignedToAnAccountUsingAccountId(id);
        return new Account(id, username, password, skills, assignedProjectList, null);

    }

    static async viewAllAccounts() {
        let allAccountsArr = [];
        let numberOfAccounts = await requestsToPyServer.getNumberOfRowsOfAccountsTable();
        for (let i = 1; i <= numberOfAccounts; i++) {
            let accountName = await requestsToPyServer.getAccountUsernameUsingAccountId(i);
            allAccountsArr[i] = (i + "." + accountName);
        }
        return allAccountsArr;
    }


    static async viewAvailableProjectsForAccount(username) {
        let error = [];
        let accountID = await requestsToPyServer.getAccountIDUsingAccountUsername(username);
        let numberOfProjects = await projectDAO.getNumberOfAllProjects();
        let {
            availableProjectArr,
            hasMinOneAvailable
        } = await Account.buildAvailableProjectsForAccount(accountID, numberOfProjects);
        if (hasMinOneAvailable) {
            return availableProjectArr;
        } else {
            error[0] = "There are no projects available for you now!".red;
            return error;
        }
    }


    static async buildAvailableProjectsForAccount(accountID, numberOfProjects) {
        let availableProjectArr = [];
        let hasMinOneAvailable = false;
        for (let i = 1; i <= numberOfProjects; i++) {
            let project = await projectDAO.getProjectById(i);
            let projectsTitle = project.title;
            if (await Account.checkIfSkilledEnough(accountID, i)) {
                availableProjectArr[i] = (i + "." + projectsTitle);
                hasMinOneAvailable = true;
            }
        }
        return {
            availableProjectArr: availableProjectArr,
            hasMinOneAvailable: hasMinOneAvailable
        };
    }


     async register() {
        let savedAccount = await Account.saveRegisterInfoInDB(this);
        this._id = savedAccount.id;
        let message = (Messages.RegisteredSuccessfully);
        return message;

    }

    static async saveRegisterInfoInDB(account) {
        let savedAccount = await requestsToPyServer.saveAccount(account.username, account.password);
        for (const [key, value] of account.skills) {
            await skillDAO.saveAccountSkill(key, value, account._id);
        }
        return savedAccount;
    }


    static async login(username, password) {
        let accountId = await requestsToPyServer.getAccountIDUsingAccountUsername(username);
        let account = await Account.buildFullAccountByGettingID(accountId);
        let time = Date.now();
        if (account.password === password) {
            let token = await requestsToPyServer.sendLoginInfoAndReciveTokenFromServer(username, password);
            return "login successfully! your loginToken : ".green + token;
        } else {
            return "incorrect password! please try again.".red;
        }


    }


    static async checkIfAccountHasSkill(accountID, skillID) {
        let hasThisSkill = false;
        let skillsMap = await Account.getAllSkillsMapOfAccount(accountID);
        let skill = await skillDAO.getSkillById(skillID);
        let skillName = skill.skillName;
        skillsMap.forEach((value, key) => {
            if (key === skillName) {
                hasThisSkill = true;
            }
        })
        return hasThisSkill;

    }

    static async getAllSkillsMapOfAccount(accountID) {
        let skillArray = await skillDAO.getAccountSkills(accountID);
        return await Skill.convertSkillsArrayToSkillsMap(skillArray);
    }


    static async checkIfSkilledEnough(accountID, projectID) {
        let isSkilled = true;
        let projectsSkillsMap = await Project.getAllSkillsMapOfProject(projectID);
        let accountsSkillsMap = await Account.getAllSkillsMapOfAccount(accountID);
        projectsSkillsMap.forEach((value1, key1) => {
            if (accountsSkillsMap.has(key1)) {
                if (parseInt(accountsSkillsMap.get(key1)) < parseInt(value1)) {
                    isSkilled = false;
                }
            } else isSkilled = false;
        })
        return isSkilled;

    }


}

module.exports = Account;



