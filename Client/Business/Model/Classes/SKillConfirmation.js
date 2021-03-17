const databaseClass = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/DAO.js');
const Project = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Project.js');
const Account = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Account.js');
const requestsToPyServer = require('/home/tapsi/IdeaProjects/concurency/Client/Business/RequestsToPyServer.js');


class SKillConfirmation{
    static async confirmSkill(conformerAccountUsername, targetAccountUsername, skillName) {
        let sourceUserID = parseInt(await requestsToPyServer.getAccountIDUsingAccountUsername(conformerAccountUsername));
        let otherUserID = parseInt(await requestsToPyServer.getAccountIDUsingAccountUsername(targetAccountUsername));
        let skill = await databaseClass.getSkillIdUsingSkillNameAndAccountID(skillName, otherUserID);
        let skillID = skill.id
        let hasConfirmedBefore = await SKillConfirmation.checkIfConfirmedBefore(sourceUserID, skillID);
        if (!hasConfirmedBefore) {
            await SKillConfirmation.addPointTOSkillForConfirmation(skillID);
            await SKillConfirmation.createNewConfirmation(skillID, sourceUserID);
            return (conformerAccountUsername + " confirmed " + targetAccountUsername + " s ((" + skillName + ")) skill\n ");

        } else return ("cannot confirm this skillSet! you have done it once before!".red);

    }

    static async addPointTOSkillForConfirmation(skillId) {
        let skill = await databaseClass.getSkillById(skillId);
        let skillPoint = skill.skillPoint;
        await databaseClass.updateAccountSkillPoint(skillId, skillPoint + 1);
    }

    static async createNewConfirmation(skillId, sourceUserId) {
        await databaseClass.saveConfirmation(skillId, sourceUserId);

    }

    static async checkIfConfirmedBefore(userSourceID, skillID) {
        let confirmationId = await databaseClass.getConfirmationUsingSkillIdAndAccountId(skillID, userSourceID);
        if (confirmationId === undefined  || confirmationId.length === 0) return false;
        else return true;
    }



}

module.exports = SKillConfirmation;