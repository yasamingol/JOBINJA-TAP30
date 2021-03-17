const databaseClass = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/DAO.js');
const Bid = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Bid.js');
const Skill = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Skill.js');
const toolFunctions = require('/home/tapsi/IdeaProjects/concurency/Client/Business/ToolFunctions.js');


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
        let skills = await Project.getAllSkillsMapOfProject(id);
        let budget = projectFullString.budget;
        let deadLine = projectFullString.deadline;
        let isAvailable = projectFullString.isAvailable;
        let assignedAccountId = projectFullString.assignedAccountId;
        let listOfBids = await Project.createListOfBidsForProject(id);

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
        return await Skill.convertSkillsArrayToSkillsMap(skillsArray);
    }

    static async addProject(title, budget, deadLine, skillsArr) {
        let messagesDuringAddProject;
        let skills = new Map;
        let deadline = toolFunctions.stringToDateConverter(deadLine);
        messagesDuringAddProject = Skill.buildSkillsMap(skillsArr, skills);
        let project = new Project(null,title,skills,budget,[],deadline,true,null)
        await Project.saveProjectInfo(project);
        messagesDuringAddProject[messagesDuringAddProject.length] = ("project built successfully!\n".green);
        return messagesDuringAddProject;
    }



    static async assignProject(userID, projectID) {
        await databaseClass.updateProjectAssignedAccountId(projectID, userID);
    }

    static async findTheBestUserIdBidingOnProject(projectId) {
        let listOfBidIDsForProject = await Project.createListOfBidsForProject(projectId);
        if (listOfBidIDsForProject.length !== 0) {
            return await Bid.calculateToFindTheBestBid(listOfBidIDsForProject);

        } else {
            return null;
        }
    }





}
module.exports = Project;