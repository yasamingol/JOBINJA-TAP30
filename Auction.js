
class Auction{
    static  allAuctions = [];
    constructor(projectTitle,accountWinner) {
        this.projectTitle = projectTitle;
        this.accuntWinner = accountWinner;
        Auction.allAuctions[Auction.allAuctions.length] = this;
    }
}
module.exports = Auction;

