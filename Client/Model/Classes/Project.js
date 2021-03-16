const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const controller = require('/home/tapsi/IdeaProjects/concurency/Client/Controller/Controller.js');
const databaseClass = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/DAO.js');


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

    static async getProjectById(id) {
        let project = await Project.buildFullProjectByGettingID(id);
        return project;
    }

    static async buildFullProjectByGettingID(id) {
        let projectFullString = await databaseClass.getProjectById(id);
        let title = projectFullString.title
        let skills = await controller.getAllSkillsMapOfProject(id);
        let budget = projectFullString.budget;
        let deadLine = projectFullString.deadline;
        let isAvailable = projectFullString.isAvailable;
        let assignedAccountId = projectFullString.assignedAccountId;
        let listOfBids = await controller.createListOfBidsForProject(id);

        return new Project(id, title, skills, budget, listOfBids,
            deadLine, isAvailable, assignedAccountId);

    }

}
module.exports = Project;
