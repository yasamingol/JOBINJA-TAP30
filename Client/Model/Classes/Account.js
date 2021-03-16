// const databaseClass = require('../DataBase/database');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const controller = require('/home/tapsi/IdeaProjects/concurency/Client/Controller/Controller.js');
const databaseClass = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/DAO.js');


class Account {

    static  allAccounts = [];
    constructor(id,username, password, skills,asignedProjectList,skillConfirmationList) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.skills = skills;
        this.asignedProjectList = asignedProjectList;
        this.skillConfirmationList = skillConfirmationList;
        Account.allAccounts[Account.allAccounts.length] = this;
    }

    static async getAccountById(id) {
        let account = await Account.buildFullAccountByGettingID(id);
        return account;

    }


   static async buildFullAccountByGettingID(id) {
        let accountFullString = await controller.getFullAccountById(id);
        let inputArr = accountFullString.split("/")
        let username = inputArr[0]
        let password = inputArr[1]
        let skills = await controller.getAllSkillsMapOfAccount(id);
        let assignedProjectList = await databaseClass.getAllProjectsAssignedToAnAccountUsingAccountId(id);
        return new Account(id, username, password, skills, assignedProjectList, null);

    }

    static async viewAllAccounts() {
        let allAccountsArr = [];
        let numberOfAccounts = await controller.getNumberOfRowsOfAccountsTable();
        for (let i = 1; i <= numberOfAccounts; i++) {
            let accountName = await controller.getAccountUsernameUsingAccountId(i);
            allAccountsArr[i] = (i + "." + accountName);
        }
        return allAccountsArr;
    }


    static async viewAvailableProjectsForAccount(username) {
        let error = [];
        let accountID = await controller.getAccountIDUsingAccountUsername(username);
        let numberOfProjects = await databaseClass.getNumberOfAllProjects();
        let {availableProjectArr, hasMinOneAvailable} = await Account.buildAvailableProjectsForAccount(accountID, numberOfProjects);
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
            let project = await databaseClass.getProjectById(i);
            let projectsTitle = project.title;
            if (await controller.checkIfSkilledEnough(accountID, i)) {
                availableProjectArr[i] = (i + "." + projectsTitle);
                hasMinOneAvailable = true;
            }
        }
        return {
            availableProjectArr: availableProjectArr,
            hasMinOneAvailable: hasMinOneAvailable
        };
    }

    static async register(username, skillsArr, password) {
        let messagesDuringRegistration;
        let id = await controller.getNumberOfRowsOfAccountsTable()+1;
        let skills = new Map;
        messagesDuringRegistration = controller.buildSkillsMap(skillsArr, skills);
        let account = new Account(id, username, password, skills, [], new Map);
        await Account.saveRegisterInfoInDB(account);
        messagesDuringRegistration[messagesDuringRegistration.length] = ("registered successfully!\n".green);
        return messagesDuringRegistration;

    }

    static async saveRegisterInfoInDB(account) {
        await controller.saveAccount(account.username,account.password);
        for (const [key, value] of account.skills) {
            await databaseClass.saveAccountSkill(key, value, account.id);
        }
    }


    static async login(username, password) {
        let accountId = await controller.getAccountIDUsingAccountUsername(username);
        let account = await Account.buildFullAccountByGettingID(accountId);
        let time = Date.now();
        if (account.password === password) {
            let token = await controller.sendLoginInfoAndReciveTokenFromServer(username, password);
            return "login successfully! your loginToken : ".green + token;
        } else {
            return "incorrect password! please try again.".red;
        }


    }



}
module.exports = Account;



