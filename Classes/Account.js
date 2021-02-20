// const databaseClass = require('../DataBase/database');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
let databaseClass;
class Account {
    static setDb(db){
        databaseClass = db;
    }
    static  allAccounts = [];
    constructor(id,username, skills,asignedProjectList,skillConfirmationList) {
        this.id = id;
        this.username = username;
        this.skills = skills;
        this.asignedProjectList = asignedProjectList;
        this.skillConfirmationList = skillConfirmationList;
        Account.allAccounts[Account.allAccounts.length] = this;
    }

}
module.exports = Account;



