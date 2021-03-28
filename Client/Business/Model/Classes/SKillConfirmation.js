const requestsToPyServer = require('/home/tapsi/IdeaProjects/concurency/Client/Business/RequestsToPyServer.js');
const skillDAO = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Skill.js');
const confirmationDAO = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Confirmation.js');
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');


class SKillConfirmation {

    static async confirmSkill(conformerAccountUsername, targetAccountUsername, skillName) {
        let sourceUserID = parseInt(await requestsToPyServer.getAccountIDUsingAccountUsername(conformerAccountUsername));
        let otherUserID = parseInt(await requestsToPyServer.getAccountIDUsingAccountUsername(targetAccountUsername));
        let skill = await skillDAO.getSkillIdUsingSkillNameAndAccountID(skillName, otherUserID);
        let skillID = skill.id

        await SKillConfirmation.addPointTOSkillForConfirmation(skillID);
        await SKillConfirmation.createNewConfirmation(skillID, sourceUserID);

        return (conformerAccountUsername + " confirmed " + targetAccountUsername + " s ((" + skillName + ")) skill\n ");

    }

    static async addPointTOSkillForConfirmation(skillId) {
        let skill = await skillDAO.getSkillById(skillId);
        let skillPoint = skill.skillPoint;
        await skillDAO.updateAccountSkillPoint(skillId, skillPoint + 1);
    }

    static async createNewConfirmation(skillId, sourceUserId) {
        await confirmationDAO.saveConfirmation(skillId, sourceUserId);

    }

    static async checkIfConfirmedBefore(conformerAccountUsername, targetAccountUsername, skillName) {
        let sourceUserID = parseInt(await requestsToPyServer.getAccountIDUsingAccountUsername(conformerAccountUsername));
        let otherUserID = parseInt(await requestsToPyServer.getAccountIDUsingAccountUsername(targetAccountUsername));
        let skill = await skillDAO.getSkillIdUsingSkillNameAndAccountID(skillName, otherUserID);
        let skillID = skill.id
        let confirmationId = await confirmationDAO.getConfirmationUsingSkillIdAndAccountId(skillID, sourceUserID);
        if (confirmationId === undefined || confirmationId.length === 0) return false;
        else return true;
    }


}

module.exports = SKillConfirmation;