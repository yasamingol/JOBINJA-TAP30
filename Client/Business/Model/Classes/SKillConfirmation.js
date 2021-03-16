const controller = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Controller.js');
const databaseClass = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/DAO.js');
const Project = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Project.js');
const Account = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Account.js');

class SKillConfirmation{
    static async confirmSkill(conformerAccountUsername, targetAccountUsername, skillName) {
        let sourceUserID = parseInt(await controller.getAccountIDUsingAccountUsername(conformerAccountUsername));
        let otherUserID = parseInt(await controller.getAccountIDUsingAccountUsername(targetAccountUsername));
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


    static async checkIfSkilledEnough(accountID, projectID) {
        let isSkilled = true;
        let projectsSkillsMap = await Project.getAllSkillsMapOfProject(projectID);
        let accountsSkillsMap = await Skill.getAllSkillsMapOfAccount(accountID);
        projectsSkillsMap.forEach((value1, key1) => {
            if (accountsSkillsMap.has(key1)) {
                if (parseInt(accountsSkillsMap.get(key1)) < parseInt(value1)) {
                    isSkilled = false;
                }
            } else isSkilled = false;
        })
        return isSkilled;

    }


    static async convertSkillsArrayToSkillsMap(arr) {
        let skillMap = new Map();
        for (let i = 0; i < arr.length; i++) {
            let skillID = arr[i].id;
            let skill = await databaseClass.getSkillById(skillID)
            let skillName = skill.skillName;
            let skillPoint = skill.skillPoint;
            skillMap.set(skillName, skillPoint);
        }
        return skillMap;
    }


}