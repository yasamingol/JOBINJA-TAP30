const requestsToPyServer = require('/home/tapsi/IdeaProjects/concurency/Client/Business/RequestsToPyServer.js');
const Skill = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Skill.js');
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
        let account = new Account(username, password, skills);
        account._id = id;
        account._assignedProjectList = assignedProjectList;
        return account;


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


    static async getAvailableProjectsForAccount(username) {
        let account = await Account.getFullAccountByUsername(username)
        let {availableProjectArr, hasMinOneAvailable}
            = await account.buildAvailableProjectsForAccount();
        if (hasMinOneAvailable) {
            return availableProjectArr;
        } else {
            return Messages.NoProjectIsAvailableError;
        }
    }

    static async getFullAccountByUsername(username) {
        let accountID = await requestsToPyServer.getAccountIDUsingAccountUsername(username);
        let account = await this.buildFullAccountByGettingID(accountID);
        return account
    }


    async buildAvailableProjectsForAccount() {
        let availableProjectArr = [];
        let hasMinOneAvailable = false;
        let numberOfProjects = await projectDAO.getNumberOfAllProjects();
        for (let i = 1; i <= numberOfProjects; i++) {
            let project = await projectDAO.getProjectById(i);
            let projectsTitle = project.title;
            if (await this.checkIfSkilledEnough(i)) {
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
        let savedAccountId = await Account.saveRegisterInfoInDB(this);
        this._id = savedAccountId;
        let message = (Messages.RegisteredSuccessfully);
        return message;

    }

    static async saveRegisterInfoInDB(account) {
        let savedAccountId = await requestsToPyServer.saveAccount(account.username, account.password);
        for (const [key, value] of account.skills) {
            await skillDAO.saveAccountSkill(key, value, savedAccountId);
        }
        return savedAccountId;
    }


    static async login(username, password) {
        let accountId = await requestsToPyServer.getAccountIDUsingAccountUsername(username);
        let account = await Account.buildFullAccountByGettingID(accountId);
        if (account.password === password) {
            let token = await requestsToPyServer.sendLoginInfoAndReciveTokenFromServer(username, password);
            return {
                message: Messages.LoginSuccessfully,
                token: token
            };
        } else {
            return Messages.IncorrectPassword;
        }

    }


    static async checkIfAccountHasSkill(username, skillName) {
        let accountID = await requestsToPyServer.getAccountIDUsingAccountUsername(username);
        let skill = await skillDAO.getSkillUsingSkillNameAndAccountID(skillName, accountID);

        if (skill == undefined) {
            return false;
        } else {
            return true;
        }
    }


    static async getAllSkillsMapOfAccount(accountID) {
        let skillArray = await skillDAO.getAccountSkills(accountID);
        return await Skill.convertSkillsArrayToSkillsMap(skillArray);
    }


    async checkIfSkilledEnough(projectId) {
        const ProjectXX = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Project.js');
        let isSkilled = true;
        let accountsSkillsMap = await Account.getAllSkillsMapOfAccount(this._id);
        let projectsSkillsMap = await ProjectXX.getAllSkillsMapOfProject(projectId);
        projectsSkillsMap.forEach((value1, key1) => {
            if (accountsSkillsMap.has(key1)) {
                if (parseInt(accountsSkillsMap.get(key1)) < parseInt(value1)) {
                    isSkilled = false;
                }
            } else isSkilled = false;
        })
        return isSkilled;

    }

    static async calculateBidUserOverAllBidWorth(bid) {
        const Project = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Project.js');
        let project = await Project.buildFullProjectByGettingID(bid.projectID);
        let account = await Account.buildFullAccountByGettingID(bid.userID);
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


}

module.exports = Account;



