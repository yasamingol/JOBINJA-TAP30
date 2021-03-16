const Project = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Project.js');
const Skill = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Skill.js');
const Confirmation = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Confirmation.js');
const Bid = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Bid.js');
const Auction = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Auction.js');

/*****************************************************Project*********************************************************/
const projectClass = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Project.js')

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
const auctionClass = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Auction.js')

async function saveAuction(auction) {
    await Auction.query().insert(
        {
            projectID: auction.projectID,
            winnerID: auction.accountID
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
const bidClass = require('/home/tapsi/IdeaProjects/concurency/Client/Business/Model/Classes/Bid.js')

// Bids functions
async function saveBid(bid) {

    await Bid.query().insert(
        {
            userId: bid.userID,
            projectId: bid.projectID,
            bidAmount: bid.bidAmount
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
    let bidsOfProject = await Bid.query().where('projectId', projectId);
    return bidsOfProject;
}


/**************************************************Confirmation*******************************************************/
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




