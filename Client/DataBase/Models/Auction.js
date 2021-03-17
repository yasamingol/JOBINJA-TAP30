const { Model } = require('objection');
const knex = require('/home/tapsi/IdeaProjects/concurency/knex.js');
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


    static async saveAuction(auction) {
        await Auction.query().insert(
            {
                projectID: auction.projectID,
                winnerID: auction.accountID
            }
        )
        console.log("auction saved successfully!")
    }

    static async getAuctionById(id) {
        let auction = await Auction.query().findById(id);
        return auction;
    }

    static async updateAuctionWinner(auctionID, userID) {
        await Auction.query().update({winnerID: userID}).where('id', auctionID);
    }

    static async getNumberOfAllAuctions() {
        let allAuctions = Auction.query();
        return allAuctions.length;
    }



}



module.exports = Auction