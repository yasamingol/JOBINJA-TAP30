const requestsToPyServer = require('/home/tapsi/IdeaProjects/concurency/Client/Business/RequestsToPyServer.js');
const skillDAO = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Skill.js');
const Messages = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Messages.js');

class Skill{
    static allSkills = [];

    static buildSkillsMap(skillsArr) {
        let arrOfMessagesWhileBuildingSKillsMap = [];
        let skillsMap = new Map;
        for (let i = 0; i < skillsArr.length; i++) {
            let arrSkills = skillsArr[i].split(":");
            let skillName = arrSkills[0];
            let skillPoint = arrSkills[1];
            if (Skill.checkIfSkillIsValid(skillName)) {
                skillsMap.set(skillName, skillPoint);
                arrOfMessagesWhileBuildingSKillsMap[i] = (Messages.SkillAddedSuccessfully);
            } else {
                arrOfMessagesWhileBuildingSKillsMap[i] = (Messages.SkillIsInValid);
            }

        }
        return {
            skillsMap: skillsMap,
            message: arrOfMessagesWhileBuildingSKillsMap
        };
    }


    static async calculateUserSkill(bid) {
        let project = await this.buildFullProjectByGettingID(bid.projectID);
        let account = await this.buildFullAccountByGettingID(bid.userID);
        let jobOffer = project.budget;
        let userOffer = bid.bidAmount;
        let skillSum = 0;
        project.skills.forEach((value, key) => {
            let jobSkill = parseInt(value);
            let userSkill = parseInt(account.skills.get(key));
            skillSum += 1000 * ((userSkill - jobSkill) * (userSkill - jobSkill));
        })
        return skillSum + (jobOffer - userOffer);
    }



   static async addSkill(username, skillName, skillPoint) {
        let accountID = await requestsToPyServer.getAccountIDUsingAccountUsername(username);
        if (Skill.checkIfSkillIsValid(skillName)) {
            await skillDAO.saveAccountSkill(skillName, skillPoint, accountID);
            return ("skill added successfully!\n".green);
        } else {
            return ("such skill does not exist!".red);
        }
    }


    static checkIfSkillIsValid(givenSkill) {
        let skillIsValid = false;
        Skill.allSkills.forEach((skill) => {
            if (skill.name === givenSkill) skillIsValid = true;
        })
        return skillIsValid;
    }



    static async removeSkill(username, skillName) {
        let accountID = await requestsToPyServer.getAccountIDUsingAccountUsername(username);
        let skill = await skillDAO.getSkillIdUsingSkillNameAndAccountID(skillName, accountID);
        let skillID = skill.id;
        if (await Skill.checkIfAccountHasSkill(accountID, skillID)) {
            await skillDAO.deleteSkillOfAccountUsingSkillName(skillID);
            return ("skill removed successfully!\n".green);

        } else {
            return ("user does not have such skill!".red);
        }
    }

    static async convertSkillsArrayToSkillsMap(arr) {
        let skillMap = new Map();
        for (let i = 0; i < arr.length; i++) {
            let skillID = arr[i].id;
            let skill = await skillDAO.getSkillById(skillID)
            let skillName = skill.skillName;
            let skillPoint = skill.skillPoint;
            skillMap.set(skillName, skillPoint);
        }
        return skillMap;
    }


}
module.exports = Skill;