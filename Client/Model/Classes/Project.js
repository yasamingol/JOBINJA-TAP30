const databaseClass = require('../../../DataBase/database');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');


class Project {
    static allProjects = [];
    constructor(id,title, skills, budget, listOfBids,deadline,isAvailable,assignedAccountId) {
        this.id = id;
        this.title = title;
        this.skills = skills;
        this.budget = budget;
        this.listOfBids = listOfBids;
        this.deadline = deadline;
        this.isAvailable = isAvailable;
        this.assignedAccountId = assignedAccountId;
        Project.allProjects[Project.allProjects.length] = this;
    }

    static async getProjectByTitle(title) {

    }

}
module.exports = Project;
