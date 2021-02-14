
class Auction{
    static  allAuctions = [];
    constructor(id,projectTitle,accountWinner) {
        this.id = id;
        this.projectTitle = projectTitle;
        this.accuntWinner = accountWinner;
        Auction.allAuctions[Auction.allAuctions.length] = this;
    }
}
module.exports = Auction;

