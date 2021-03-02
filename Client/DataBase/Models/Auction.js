const { Model } = require('objection');
const knex = require('/home/tapsi/IdeaProjects/concurency/knex.js')
Model.knex(knex);

class Auction extends Model {
    static get tableName() {
        return 'Auctions';
    }

    static get relationalMappings() {
        // const Project = require('./Project');
        return {
            projectID: {
                relation: Model.HasOneRelation,
                modelClass: Project,
                join: {
                    from: 'Auctions.projectID',
                    to: 'Projects.id'
                }
            }
        }
    }

}



module.exports = Auction