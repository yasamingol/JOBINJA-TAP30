const requestsToPyServer = require('/home/tapsi/IdeaProjects/concurency/Client/Business/RequestsToPyServer.js');
const Account = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Account.js');
const projectDAO = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Project.js');
const bidDAO = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Bid.js');

class Bid {
    static allBids = [];
    constructor(id,userID, projectID, bidAmount) {
        this.id = id;
        this.userID = userID;
        this.projectID = projectID;
        this.bidAmount = bidAmount;
        Bid.allBids[Bid.allBids.length] = this;
    }


    static async buildFullBidUsingBidID(bidID) {
        let bid = await bidDAO.getBidById(bidID)
        let userId = bid.userId;
        let projectId = bid.projectId;
        let bidAmount = bid.bidAmount;
        return new Bid(bidID, userId, projectId, bidAmount);
    }





   static async addBid(biddingUsername, projectTitle, bidAmount) {
        let addBidsFinalMessage;
        let project = await projectDAO.getProjectByProjectTitle(projectTitle)
        let projectId = project.id;
        let accountId = await requestsToPyServer.getAccountIDUsingAccountUsername(biddingUsername);
        let bid = new Bid(null,accountId,projectId,bidAmount);
        addBidsFinalMessage = await Bid.handlingAddBidErrors(bid);
        return addBidsFinalMessage;
    }


    static async handlingAddBidErrors( bid) {
        let project = await projectDAO.getProjectById(bid.projectID);
        if (!(project.isAvailable)) {
            return "cannot bid! project has already been taken.".red;
        } else if (!(await Account.checkIfSkilledEnough(bid.userID, bid.projectID))) {
            return "cannot bid! not skilled enough.".red;
        } else if (!(await Bid.checkIfBidEnough(bid.projectID, bid.bidAmount))) {
            return "cannot bid! bid amount not acceptable".red;
            // } else if (!(await checkIfValidDateToBid(bid.projectID))) {
            //     return "you cannot bid on this project! it has ended".red;
        } else {
            return (await Bid.createBid(bid));
        }
    }

    static async createBid(bid) {
        await bidDAO.saveBid(bid);
        return "bid created successfully!\n".green;

    }

    static async checkIfBidEnough(projectId, userBidAmount) {
        let project = await projectDAO.getProjectById(projectId);
        let bidIsEnough = false;
        let mainBidAmount = project.budget;
        if (userBidAmount <= mainBidAmount) bidIsEnough = true;
        return bidIsEnough;
    }

    static async checkIfValidDateToBid(projectId) {
        let project = await projectDAO.getProjectById(projectId);
        let projectDeadline = project.deadline;
        let localDate = Date.now();
        return parseInt(projectDeadline) >= parseInt(localDate/10000000000);

    }

    static async calculateToFindTheBestBid(listOfBidIDsForProject) {
        let bestBid = 0;
        let bestUserId;
        for (let i = 0; i < listOfBidIDsForProject.length; i++) {
            let bidId = listOfBidIDsForProject[i].id
            let bid = await this.buildFullBidUsingBidID(bidId);
            let userSkill = parseInt(await this.calculateUserSkill(bid));
            if (userSkill > bestBid) {
                bestBid = userSkill;
                bestUserId = bid.userID;
            }
        }
        return bestUserId;
    }




}
module.exports = Bid;