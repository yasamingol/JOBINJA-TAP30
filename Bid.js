class Bid {
    static allBids = [];
    constructor(username, projectTitle, bidAmount) {
        this.username = username;
        this.projectaTitle = projectTitle;
        this.bidAmount = bidAmount;
        Bid.allBids[Bid.allBids.length] = this;
    }
}
module.exports = Bid;