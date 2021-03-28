const Project = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Project.js');
const requestsToPyServer = require('/home/tapsi/IdeaProjects/concurency/Client/Business/RequestsToPyServer.js');
const projectDAO = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Project.js');
const auctionDAO = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Auction.js');
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');


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



    static async holdAuctionForProject(projectId) {
        let project = await Project.buildFullProjectByGettingID(projectId)
        let accountWinnerID = await project.findTheBestUserIdBidingOnProject();
        if (accountWinnerID !== null) {
            let auction = new Auction(null,accountWinnerID,projectId)
            await auctionDAO.saveAuction(auction);
            await projectDAO.updateProjectAvailability(projectId);
            await Project.assignProject(accountWinnerID, projectId);
            return "\nThe winner of the auction is : ".green
                + await requestsToPyServer.getAccountUsernameUsingAccountId(accountWinnerID);
        } else {
            return Messages.ProjectHasNoBid;
        }
    }


    static async isAuctionDay(projectId) {
        let project  = await projectDAO.getProjectById(projectId);
        let projectDeadline = project.deadline
        let localDate = Date.now();
        return projectDeadline <= localDate;

    }

}
module.exports = Auction;

