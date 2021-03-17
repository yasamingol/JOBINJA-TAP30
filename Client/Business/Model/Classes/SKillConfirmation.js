const Project = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Project.js');
const Account = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Account.js');
const requestsToPyServer = require('/home/tapsi/IdeaProjects/concurency/Client/Business/RequestsToPyServer.js');
const projectDAO = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Project.js');
const skillDAO = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Skill.js');
const confirmationDAO = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Confirmation.js');
const bidDAO = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Bid.js');
const auctionDAO = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Auction.js');


class SKillConfirmation{
    static async confirmSkill(conformerAccountUsername, targetAccountUsername, skillName) {
        let sourceUserID = parseInt(await requestsToPyServer.getAccountIDUsingAccountUsername(conformerAccountUsername));
        let otherUserID = parseInt(await requestsToPyServer.getAccountIDUsingAccountUsername(targetAccountUsername));
        let skill = await skillDAO.getSkillIdUsingSkillNameAndAccountID(skillName, otherUserID);
        let skillID = skill.id
        let hasConfirmedBefore = await SKillConfirmation.checkIfConfirmedBefore(sourceUserID, skillID);
        if (!hasConfirmedBefore) {
            await SKillConfirmation.addPointTOSkillForConfirmation(skillID);
            await SKillConfirmation.createNewConfirmation(skillID, sourceUserID);
            return (conformerAccountUsername + " confirmed " + targetAccountUsername + " s ((" + skillName + ")) skill\n ");

        } else return ("cannot confirm this skillSet! you have done it once before!".red);

    }

    static async addPointTOSkillForConfirmation(skillId) {
        let skill = await skillDAO.getSkillById(skillId);
        let skillPoint = skill.skillPoint;
        await skillDAO.updateAccountSkillPoint(skillId, skillPoint + 1);
    }

    static async createNewConfirmation(skillId, sourceUserId) {
        await confirmationDAO.saveConfirmation(skillId, sourceUserId);

    }

    static async checkIfConfirmedBefore(userSourceID, skillID) {
        let confirmationId = await confirmationDAO.getConfirmationUsingSkillIdAndAccountId(skillID, userSourceID);
        if (confirmationId === undefined  || confirmationId.length === 0) return false;
        else return true;
    }



}

module.exports = SKillConfirmation;