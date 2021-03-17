const Project = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Project.js');
const requestsToPyServer = require('/home/tapsi/IdeaProjects/concurency/Client/Business/RequestsToPyServer.js');
const projectDAO = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Project.js');
const auctionDAO = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Auction.js');


class Auction{
    static  allAuctions = [];
    constructor(id,projectID,accountID) {
        this.id = id;
        this.projectID = projectID;
        this.accountID = accountID;
        Auction.allAuctions[Auction.allAuctions.length] = this;
    }

    static async holdAuctionsForAllProjects() {
        let numberOfProjects = await projectDAO.getNumberOfAllProjects();
        for (let i = 1; i <= numberOfProjects; i++) {
            let projectID = i;
            if (await Auction.isAuctionDay(projectID)) {
                await Auction.holdAuction(projectID);
            }
        }
    }

    static async holdAuction(projectId) {
        let messageOfHoldAuction = "";
        let project = await projectDAO.getProjectById(projectId);
        if (!(project.isAvailable)) {
            messageOfHoldAuction = ("project is not available! already taken.".red);
        } else {
            messageOfHoldAuction = await Auction.handlingAuctionProcess(projectId);
        }
        return messageOfHoldAuction;
    }


    static async handlingAuctionProcess(projectId) {
        let messageOfHoldAuction = "";
        let accountWinnerID = await Project.findTheBestUserIdBidingOnProject(projectId);
        if (accountWinnerID !== null) {
            let auction = new Auction(null,accountWinnerID,projectId)
            await auctionDAO.saveAuction(auction);
            await projectDAO.updateProjectAvailability(projectId);
            await Project.assignProject(accountWinnerID, projectId);
            messageOfHoldAuction = ("\nThe winner of the auction is : ".green
                + await requestsToPyServer.getAccountUsernameUsingAccountId(accountWinnerID));
        } else {
            messageOfHoldAuction = ("there are no bids on this project! cannot hold auction".red);
        }
        return messageOfHoldAuction;
    }


    static async createNewAuction(auction) {
        return new Auction(auction);
    }


    static async isAuctionDay(projectId) {
        let project  = await projectDAO.getProjectById(projectId);
        let projectDeadline = project.deadline
        let localDate = Date.now();
        return projectDeadline <= localDate;

    }

}
module.exports = Auction;

