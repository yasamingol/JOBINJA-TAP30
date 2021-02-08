class Project {
    static allProjects = [];
    constructor(title, skills, budget, listOfBids) {
        this.title = title;
        this.skills = skills;
        this.budget = budget;
        this.listOfBids = listOfBids;
        Project.allProjects[Project.allProjects.length] = this;
    }
    static getProjectByTitle(title) {
        for (let i = 0; i < Project.allProjects.length; i++) {
            if (Project.allProjects[i].title === title) {
                return Project.allProjects[i];
            }
        }
        console.log("this project does not exist");
    }

}
module.exports = Project;
