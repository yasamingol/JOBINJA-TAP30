
class Auction{
    static  allAuctions = [];
    constructor(id,projectID,accountID) {
        this.id = id;
        this.projectID = projectID;
        this.accountID = accountID;
        Auction.allAuctions[Auction.allAuctions.length] = this;
    }
}
module.exports = Auction;

