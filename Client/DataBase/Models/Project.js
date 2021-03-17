const {Model} = require('objection');
const knex = require('/home/tapsi/IdeaProjects/concurency/knex.js')
Model.knex(knex);


class Project extends Model {
    static get tableName() {
        return 'Projects';
    }

    static get relationalMappings() {

    }

    static async saveProject(project) {

        await Project.query().insert(
            {
                title: project.title,
                budget: project.budget,
                deadline: project.deadline,
                isAvailable: project.isAvailable,
                assignedAccountId: project.assignedAccountId
            })
        console.log("project saved successfully!")
    }

    static async getProjectById(id) {
        let project = await Project.query().findById(id);
        return project;
    }


    static async getProjectByProjectTitle(title) {
        let project = await Project.query().where('title', title).first()
        return project;
    }


    static async updateProjectAvailability(id) {
        await Project.query().update({isAvailable: false}).where('id', id);
    }


    static async updateProjectAssignedAccountId(projectID, accountID) {
        await Project.query().update({assignedAccountId: accountID}).where('id', projectID);
    }


    static async getAllProjectsAssignedToAnAccountUsingAccountId(accountID) {
        let projectsAssignedToAccount = await Project.query().where('assignedAccountId', accountID);
        return projectsAssignedToAccount;
    }


    static async getNumberOfAllProjects() {
        let projects = await Project.query()
        return projects.length;
    }


}



module.exports = Project
