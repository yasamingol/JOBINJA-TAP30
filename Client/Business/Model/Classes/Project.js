const Bid = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Bid.js');
const Skill = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Skill.js');
const toolFunctions = require('/home/tapsi/IdeaProjects/concurency/Client/Business/ToolFunctions.js');
const projectDAO = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Project.js');
const skillDAO = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Skill.js');
const bidDAO = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Bid.js');
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');


class Project {
    _id;
    _listOfBids;
    _assignedAccountId;

    static allProjects = [];
    constructor(title, skills, budget,deadline,isAvailable) {
        this.title = title;
        this.skills = skills;
        this.budget = budget;
        this.deadline = deadline;
        this.isAvailable = isAvailable;
        Project.allProjects[Project.allProjects.length] = this;

    }


    set id(value) {
        this._id = value;
    }

    set listOfBids(value) {
        this._listOfBids = value;
    }

    set assignedAccountId(value) {
        this._assignedAccountId = value;
    }



    static async getProjectById(id) {
        let project = await Project.buildFullProjectByGettingID(id);
        return project;
    }

    static async buildFullProjectByGettingID(id) {
        let projectFullString = await projectDAO.getProjectById(id);
        let title = projectFullString.title
        let skills = await Project.getAllSkillsMapOfProject(id);
        let budget = projectFullString.budget;
        let deadLine = projectFullString.deadline;
        let isAvailable = projectFullString.isAvailable;
        let assignedAccountId = projectFullString.assignedAccountId;
        let listOfBids = await Project.createListOfBidsForProject(id);

        let project =  new Project(title, skills, budget, deadLine, isAvailable);
        project._id = id;
        project._assignedAccountId = assignedAccountId;
        project._listOfBids = listOfBids;

        return project;

    }


    static async viewAllProjects() {
        let allProjectsArray = [];
        let numberOfProjects = await projectDAO.getNumberOfAllProjects();
        for (let i = 1; i <= numberOfProjects; i++) {
            let project = await projectDAO.getProjectById(i);
            let projectsTitle = project.title;
            allProjectsArray[i] = (i + "." + projectsTitle);
        }
        return allProjectsArray;
    }

     async saveProjectInfo() {
        await projectDAO.saveProject(this);
        let projectCreated = await projectDAO.getProjectByProjectTitle(this.title);
        for (const [key, value] of this.skills) {
            await skillDAO.saveProjectSkill(key, value, projectCreated.id);
        }
        return projectCreated;
    }


    static async createListOfBidsForProject(projectID) {
        let listOfBids = await bidDAO.getBidsOfProjectByProjectId(projectID);
        return listOfBids;

    }


    static async getAllSkillsMapOfProject(projectID) {
        let skillsArray = await skillDAO.getProjectSkills(projectID);
        return await Skill.convertSkillsArrayToSkillsMap(skillsArray);
    }


     async addProject() {
        let savedProject = await this.saveProjectInfo();
        this._id = savedProject.id;
        let messagesDuringAddProject = (Messages.ProjectBuiltSuccessfully);
        return messagesDuringAddProject;

    }



    static async assignProject(userID, projectID) {
        await projectDAO.updateProjectAssignedAccountId(projectID, userID);
    }

    async findTheBestUserIdBidingOnProject() {
        let listOfBidIDsForProject = await Project.createListOfBidsForProject(this);
        if (listOfBidIDsForProject.length !== 0) {
            return await Bid.calculateToFindTheBestBid(listOfBidIDsForProject);

        } else {
            return null;
        }
    }

    static async checkIfProjectIsAvailable(projectId) {
        let project = await projectDAO.getProjectById(projectId);
        return project.isAvailable;
    }





}
module.exports = Project;
