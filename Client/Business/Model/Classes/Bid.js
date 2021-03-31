const requestsToPyServer = require('/home/tapsi/IdeaProjects/concurency/Client/Business/RequestsToPyServer.js');
const Account = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Account.js');
const projectDAO = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Project.js');
const bidDAO = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Bid.js');
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');


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


    static async createBidObject(biddingUsername, projectTitle, bidAmount){
        let project = await projectDAO.getProjectByProjectTitle(projectTitle);
        let projectId = project.id;
        let accountId = await requestsToPyServer.getAccountIDUsingAccountUsername(biddingUsername);
        let bid = new Bid(null,accountId,projectId,bidAmount);
        return bid;
    }


    static async checkIfBidIsValid(bid) {
        let project = await projectDAO.getProjectById(bid.projectID);
        let account = await Account.getAccountById(bid.userID);
        if (!(project.isAvailable)) {
            return {
                message: Messages.ProjectIsNotAvailableError,
                isBidValid: false
            };
        }
        else if (!(await account.checkIfSkilledEnough(this.projectID))) {
            return {
                message: Messages.NotSkilledEnoughError,
                isBidValid: false
            };
        }
        else if (!(await Bid.checkIfBidEnough(this.projectID, this.bidAmount))) {
            return {
                message: Messages.BidIsNotEnoughError,
                isBidValid: false
            };
        }
        else {
            return {
                message: Messages.BidIsValid,
                isBidValid: true
            }
        }
    }


    static async createBid(bid) {
        await bidDAO.saveBid(bid);
        return Messages.BidAddedSuccessfully;

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
            let userSkill = parseInt(await Account.calculateBidUserOverAllBidWorth(bid));
            if (userSkill > bestBid) {
                bestBid = userSkill;
                bestUserId = bid.userID;
            }
        }
        return bestUserId;
    }






}
module.exports = Bid;