class Bid {
    static allBids = [];
    constructor(id,username, projectTitle, bidAmount) {
        this.id = id;
        this.username = username;
        this.projectaTitle = projectTitle;
        this.bidAmount = bidAmount;
        Bid.allBids[Bid.allBids.length] = this;
    }
}
module.exports = Bid;