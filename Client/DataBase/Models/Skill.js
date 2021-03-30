const {Model} = require('objection');
const knex = require('/home/tapsi/IdeaProjects/concurency/knex.js');
Model.knex(knex);


class Skill extends Model {
    static get tableName() {
        return 'Skills';
    }

    static get relationalMappings() {
        // const Project = require('./Project');
        return {
            projectID: {
                relation: Model.HasOneRelation,
                modelClass: Project,
                join: {
                    from: 'Skills.projectID',
                    to: 'Projects.id'
                }
            }

        }
    }

    static async saveAccountSkill(skillName, skillPoint, accountId) {
        await Skill.query().insert(
            {
                skillName: skillName,
                skillPoint: skillPoint,
                accountID: accountId,
                projectID: -1
            }
        )
        console.log("accountSkill saved successfully!")
    }

   static async saveProjectSkill(skillName, skillPoint, projectId) {
        await Skill.query().insert(
            {
                skillName: skillName,
                skillPoint: skillPoint,
                accountID: -1,
                projectID: projectId
            }
        )
        console.log("projectSkill saved successfully!")
    }

    static async getSkillById(id) {
        let skill = await Skill.query().findById(id);
        return skill;
    }

    static async updateAccountSkillPoint(skillID, skillPoint) {
        await Skill.query().update({skillPoint: skillPoint}).where('id', skillID);
    }

    static async getProjectSkills(projectId) {
        let project = await Skill.query().where('projectID', projectId);
        return project;
    }

    static async getAccountSkills(accountId) {
        let account = await Skill.query().where('accountID', accountId);
        return account;
    }

    static async deleteSkillOfAccountUsingSkillName(skillId) {
        await Skill.query().delete().where('id', skillId);
        console.log("account skill removed from DB successfully");
    }

    static async getSkillUsingSkillNameAndAccountID(skillName, accountId) {
        let skill = await Skill.query().where('skillName', skillName).andWhere('accountID', accountId).first();
        return skill
    }

    static async getNumberOfAllSkills() {
        let allSkills = await Skill.query();
        return allSkills.length;
    }
}


module.exports = Skill

