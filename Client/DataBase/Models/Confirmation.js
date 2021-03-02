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
}



module.exports = Confirmation
