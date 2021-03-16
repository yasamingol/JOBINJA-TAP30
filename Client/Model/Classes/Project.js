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


    static async viewAllProjects() {
        let allProjectsArray = [];
        let numberOfProjects = await databaseClass.getNumberOfAllProjects();
        for (let i = 1; i <= numberOfProjects; i++) {
            let project = await databaseClass.getProjectById(i);
            let projectsTitle = project.title;
            allProjectsArray[i] = (i + "." + projectsTitle);
        }
        return allProjectsArray;
    }

    static async saveProjectInfo(project) {
        await databaseClass.saveProject(project);
        let projectCreate = await databaseClass.getProjectByProjectTitle(project.title);
        for (const [key, value] of project.skills) {
            await databaseClass.saveProjectSkill(key, value, projectCreate.id);
        }
    }

    static async createListOfBidsForProject(projectID) {
        let listOfBids = await databaseClass.getBidsOfProjectByProjectId(projectID);
        return listOfBids;

    }

    static async getAllSkillsMapOfProject(projectID) {
        let skillsArray = await databaseClass.getProjectSkills(projectID);
        return await controller.convertSkillsArrayToSkillsMap(skillsArray);
    }

    static async addProject(title, budget, deadLine, skillsArr) {
        let messagesDuringAddProject;
        let skills = new Map;
        let deadline = controller.stringToDateConverter(deadLine);
        messagesDuringAddProject = controller.buildSkillsMap(skillsArr, skills);
        let project = new Project(null,title,skills,budget,[],deadline,true,null)
        await Project.saveProjectInfo(project);
        messagesDuringAddProject[messagesDuringAddProject.length] = ("project built successfully!\n".green);
        return messagesDuringAddProject;
    }



    static async assignProject(userID, projectID) {
        await databaseClass.updateProjectAssignedAccountId(projectID, userID);
    }





}
module.exports = Project;
