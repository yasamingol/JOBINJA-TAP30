const { Model } = require('objection');
const knex = require('/home/tapsi/IdeaProjects/concurency/knex.js')
Model.knex(knex);

class Bid extends Model {
    static get tableName() {
        return 'Bids';
    }

    static get relationalMappings() {
        // const Project = require('./Project');
        return {
            projectID: {
                relation: Model.HasOneRelation,
                modelClass: Project,
                join: {
                    from: 'Bids.projectID',
                    to: 'Projects.id'
                }
            }

        }
    }
}




module.exports = Bid
