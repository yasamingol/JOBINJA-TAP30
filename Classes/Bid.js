class Bid {
    static allBids = [];
    constructor(id,userID, projectID, bidAmount) {
        this.id = id;
        this.userID = userID;
        this.projectID = projectID;
        this.bidAmount = bidAmount;
        Bid.allBids[Bid.allBids.length] = this;
    }
}
module.exports = Bid;