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

    static async saveBid(bid) {

        await Bid.query().insert(
            {
                userId: bid.userID,
                projectId: bid.projectID,
                bidAmount: bid.bidAmount
            }
        )
        console.log("bid saved successfully!")
    }

    static async getBidById(id) {
        let bid = await Bid.query().findById(id);
        return bid
    }

    static async getBidByUserId(userId) {
        let bid = await Bid.query().where('userID', userId)
        return bid;
    }

    static async getBidsOfProjectByProjectId(projectId) {
        let bidsOfProject = await Bid.query().where('projectId', projectId);
        return bidsOfProject;
    }


}




module.exports = Bid
