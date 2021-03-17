const { Model } = require('objection');
const knex = require('/home/tapsi/IdeaProjects/concurency/knex.js')
Model.knex(knex);



class Confirmation extends Model {
    static get tableName() {
        return 'Confirmations';
    }

    static get relationalMappings() {
        // const Skill = require('./Skill');
        return {
            projectID: {
                relation: Model.HasOneRelation,
                modelClass: Skill,
                join: {
                    from: 'Skills.id',
                    to: 'Confirmations.skillId'
                }
            }

        }
    }


    static async saveConfirmation(skillId, sourceAccountId) {
        await Confirmation.query().insert(
            {
                skillId: skillId,
                sourceAccountId: sourceAccountId
            }
        )
        console.log("confirmation saved successfully!")
    }

    static async getConfirmationById(id) {
        let confirmation = await Confirmation.query().findById(id);
        return confirmation;
    }

    static async getConfirmationUsingSkillIdAndAccountId(skillId, accountId) {
        try {
            let confirmation = await Confirmation.query().where('skillId', skillId).where('sourceAccountId',accountId)
            return confirmation;
        }catch (e) {
            return undefined
        }

    }
}



module.exports = Confirmation
