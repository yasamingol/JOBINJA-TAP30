const {Model} = require('objection');
const knex = require('/home/tapsi/IdeaProjects/concurency/knex.js')
Model.knex(knex);

/*****************************************************Project*********************************************************/
const projectClass = require('/home/tapsi/IdeaProjects/concurency/Client/Model/Classes/Project.js')
class Project extends Model {
    static get tableName() {
        return 'Projects';
    }

    static get relationalMappings() {

    }

}

//projects functions
async function saveProject(project) {

    await Project.query().insert(
        {
            title: project.title,
            budget: project.budget,
            deadline: project.deadline,
            isAvailable: project.isAvailable,
            assignedAccountId: project.assignedAccountId
        })
    console.log("project saved successfully!")
}

async function getProjectById(id) {
    let project = await Project.query().findById(id);
    return project;
}

async function getProjectByProjectTitle(title) {
    let project = await Project.query().where('title', title).first()
    return project;
}

async function updateProjectAvailability(id) {
    await Project.query().update({isAvailable: false}).where('id', id);
}

async function updateProjectAssignedAccountId(projectID, accountID) {
    await Project.query().update({assignedAccountId: accountID}).where('id', projectID);
}

async function getAllProjectsAssignedToAnAccountUsingAccountId(accountID) {
    let projectsAssignedToAccount = await Project.query().where('assignedAccountId', accountID);
    return projectsAssignedToAccount;
}

async function getNumberOfAllProjects() {
    let projects = await Project.query()
    return projects.length;
}


/******************************************************Skill**********************************************************/
class Skill extends Model {
    static get tableName() {
        return 'Skills';
    }

    static get relationalMappings() {
        // const Project = require('./Project');
        return {
            projectID: {
                relation: Model.HasOneRelation,
                modelClass: Project,
                join: {
                    from: 'Skills.projectID',
                    to: 'Projects.id'
                }
            }

        }
    }

}

//Skill
async function saveAccountSkill(skillName, skillPoint, accountId) {
    await Skill.query().insert(
        {
            skillName: skillName,
            skillPoint: skillPoint,
            accountID: accountId,
            projectID: -1
        }
    )
    console.log("accountSkill saved successfully!")
}

async function saveProjectSkill(skillName, skillPoint, projectId) {
    await Skill.query().insert(
        {
            skillName: skillName,
            skillPoint: skillPoint,
            accountID: -1,
            projectID: projectId
        }
    )
    console.log("projectSkill saved successfully!")
}

async function getSkillById(id) {
    let skill = await Skill.query().findById(id);
    return skill;
}

async function updateAccountSkillPoint(skillID, skillPoint) {
    await Skill.query().update({skillPoint: skillPoint}).where('id', skillID);
}

async function getProjectSkills(projectId) {
    let project = await Skill.query().where('projectID', projectId);
    return project;
}

async function getAccountSkills(accountId) {
    let account = await Skill.query().where('accountID', accountId);
    return account;
}

async function deleteSkillOfAccountUsingSkillName(skillId) {
    await Skill.query().delete().where('id', skillId);
    console.log("account skill removed from DB successfully");
}

async function getSkillIdUsingSkillNameAndAccountID(skillName, accountId) {
    let skill = await Skill.query().where('skillName', skillName).andWhere('accountID', accountId).first();
    return skill
}

async function getNumberOfAllSkills() {
    let allSkills = await Skill.query();
    return allSkills.length;
}


/*****************************************************Auction*********************************************************/
class Auction extends Model {
    static get tableName() {
        return 'Skills';
    }

    static get relationalMappings() {
        // const Project = require('./Project');
        return {
            projectID: {
                relation: Model.HasOneRelation,
                modelClass: Project,
                join: {
                    from: 'Auctions.projectID',
                    to: 'Projects.id'
                }
            }
        }
    }

}

async function saveAuction(projectId, winnerId) {
    await Auction.query().insert(
        {
            projectID: projectId,
            winnerID: winnerId
        }
    )
    console.log("auction saved successfully!")
}

async function getAuctionById(id) {
    let auction = await Auction.query().findById(id);
    return auction;
}

async function updateAuctionWinner(auctionID, userID) {
    await Auction.query().update({winnerID: userID}).where('id', auctionID);
}

async function getNumberOfAllAuctions() {
    let allAuctions = Auction.query();
    return allAuctions.length;
}


/*******************************************************Bid***********************************************************/
class Bid extends Model {
    static get tableName() {
        return 'Bids';
    }

    static get relationalMappings() {
        // const Project = require('./Project');
        return {
            projectID: {
                relation: Model.HasOneRelation,
                modelClass: Project,
                join: {
                    from: 'Bids.projectID',
                    to: 'Projects.id'
                }
            }

        }
    }
}

// Bids functions
async function saveBid(userId, projectId, bidAmount) {
    await Bid.query().insert(
        {
            userId: userId,
            projectId: projectId,
            bidAmount: bidAmount
        }
    )
    console.log("bid saved successfully!")
}

async function getBidById(id) {
    let bid = await Bid.query().findById(id);
    return bid
}

async function getBidByUserId(userId) {
    let bid = await Bid.query().where('userID', userId)
    return bid;
}

async function getBidsOfProjectByProjectId(projectId) {
    let bidsOfProject = await Bid.query().where('projectID', projectId);
    return bidsOfProject;
}


/**************************************************Confirmation*******************************************************/

class Confirmation extends Model {
    static get tableName() {
        return 'Confirmations';
    }

    static get relationalMappings() {
        // const Skill = require('./Skill');
        return {
            projectID: {
                relation: Model.HasOneRelation,
                modelClass: Skill,
                join: {
                    from: 'Skills.id',
                    to: 'Confirmations.skillId'
                }
            }

        }
    }
}

//Confirmation
async function saveConfirmation(skillId, sourceAccountId) {
    await Confirmation.query().insert(
        {
            skillId: skillId,
            sourceAccountId: sourceAccountId
        }
    )
    console.log("confirmation saved successfully!")
}

async function getConfirmationById(id) {
    let confirmation = await Confirmation.query().findById(id);
    return confirmation;
}

async function getConfirmationUsingSkillIdAndAccountId(skillId, accountId) {
    try {
        let confirmation = await Confirmation.query().where('skillId', skillId).where('sourceAccountId',accountId)
        return confirmation;
    }catch (e) {
        return undefined
    }

}







(async () => {
    console.log(await Bid.query())
})()

module.exports = {
    saveProject,
    getProjectById,
    getProjectByProjectTitle,
    updateProjectAvailability,
    updateProjectAssignedAccountId,
    getAllProjectsAssignedToAnAccountUsingAccountId,
    saveAccountSkill,
    saveProjectSkill,
    getSkillById,
    updateAccountSkillPoint,
    getProjectSkills,
    getAccountSkills,
    deleteSkillOfAccountUsingSkillName,
    getSkillIdUsingSkillNameAndAccountID,
    saveAuction,
    getAuctionById,
    updateAuctionWinner,
    saveBid,
    getBidById,
    getBidByUserId,
    getBidsOfProjectByProjectId,
    saveConfirmation,
    getConfirmationById,
    getNumberOfAllProjects,
    getNumberOfAllSkills,
    getNumberOfAllAuctions,
    getConfirmationUsingSkillIdAndAccountId
}




