const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const accountClass = require("../Model/Classes/Account");
const projectClass = require("../Model/Classes/Project");
const bidClass = require("../Model/Classes/Bid");
const auctionClass = require("../Model/Classes/Auction");
let db;

(async () => {
    db = await sqlite.open({
        filename: '/home/tapsi/IdeaProjects/concurency/Client/DataBase/database.db',
        driver: sqlite3.Database
    })
})()
/************************************************ProjectsDBFunctions**************************************************/
async function createProjectsTable() {
    await db.exec('CREATE TABLE projects (id, title, budget,deadline,isAvailable,assignedAccountId)');
    console.log("Projects DB created successfully");
}

async function saveProject(project) {
    await db.run('INSERT INTO projects VALUES (?,?,?,?,?,?)',
        [project.id, project.title, project.budget, project.deadline, project.isAvailable, -1]);
    console.log("project added to DB successfully");
}

async function updateProjectAvailability(projectID) {
    await db.run('UPDATE projects SET isAvailable = ? WHERE id = ?',
        false,
        projectID
    )
    console.log("project availability updated in DB successfully");
}

async function updateProjectAssignedAccountId(projectID, accountID) {
    await db.run('UPDATE projects SET assignedAccountId = ? WHERE id = ?',
        accountID,
        projectID
    )
    console.log("project assignedAccount updated in DB successfully");
}

async function getProjectsFullDBTable() {
    return await db.all('SELECT * FROM projects')
}

async function getProjectByID(projectID) {
    return await db.get('SELECT * FROM projects WHERE id = ?', [projectID])
}

async function getProjectTitleUsingProjectId(projectID) {
    let projectTitle = await db.get('SELECT title FROM projects WHERE id = ?', [projectID]);
    return projectTitle.title;
}

async function getProjectBudgetUsingProjectId(projectID) {
   let projectBudget = await db.get('SELECT budget FROM projects WHERE id = ?', [projectID]);
    return projectBudget.budget;
}

async function getProjectDeadlineUsingProjectId(projectID) {
    let projectDeadline = await db.get('SELECT deadline FROM projects WHERE id = ?', [projectID]);
    return projectDeadline.deadline;
}

async function getProjectAvailabilityUsingProjectId(projectID) {
    let availability = await db.get('SELECT isAvailable FROM projects WHERE id = ?', [projectID]);
    return availability;
}

async function getProjectIDUsingProjectTitle(projectTitle) {
    let projectId =  await db.get('SELECT id FROM projects WHERE title = ?', [projectTitle])
    return projectId.id;
}

async function getProjectWinnerIDUsingProjectId(projectID) {
    let projectWinner = await db.get('SELECT assignedAccountId FROM projects WHERE id = ?', [projectID])
    return projectWinner.assignedAccountId;
}

async function getNumberOfRowsInProjectsTable() {
    let rowCounter = 0;
    await db.each('SELECT id FROM projects ',
        (err, row) => {
            rowCounter++;
            if (err) {
                throw err
            }
        }
    )
    return rowCounter;

}

async function getAllProjectsAssignedToAnAccountUsingAccountId(accountID) {
    return await db.all('SELECT title FROM projects WHERE assignedAccountId = ?', [accountID]);
}


/************************************************BidsDBFunctions**************************************************/
async function createBidsTable() {
    await db.exec('CREATE TABLE Bids (id, userId,projectId,bidAmount)');
    console.log("Bids DB created successfully");
}

async function saveBid(bid) {
    await db.run('INSERT INTO Bids VALUES (?,?,?,?)', [bid.id, bid.userID, bid.projectID, bid.bidAmount]);
    console.log("bid saved to DB successfully")
}

async function getBidsFullDBTable() {
    return await db.all('SELECT * FROM Bids');
}

async function getBidsUserIDUsingBidId(bidID) {
    let bidUserId = await db.get('SELECT userId FROM Bids WHERE id = ?', [bidID]);
    return bidUserId.userId;
}

async function getBidsProjectIdUsingBidId(bidID) {
    let bidProjectId =  await db.get('SELECT projectId FROM Bids WHERE id = ?', [bidID]);
    return bidProjectId.projectId;
}

async function getBidsAmountUsingBidId(bidID) {
    let bidAmount =  await db.get('SELECT bidAmount FROM Bids WHERE id = ?', [bidID]);
    return bidAmount.bidAmount;
}

async function getBidIDUsingBidUsername(bidUsername) {
    let bidId = await db.get('SELECT id FROM Bids WHERE  userId = ?', [bidUsername]);
    return bidId.id;
}

async function getNumberOfRowsInBidsTable() {
    let rowCounter = 0;
    await db.each('SELECT id FROM Bids ',
        (err, row) => {
            rowCounter++;
            if (err) {
                throw err
            }
        }
    )
    return rowCounter;

}

async function getBidsOfProjectUsingProjectId(projectId) {
    return await db.all('SELECT id FROM Bids WHERE projectId = ? ', projectId)
}

/************************************************AuctionDBFunctions**************************************************/
async function createAuctionsTable() {
    await db.exec('CREATE TABLE Auctions (id, projectID, winnerID)');
    console.log("Auctions DB created successfully");
}

async function saveAuction(id, projectID, winnerID) {
    await db.run('INSERT INTO Auctions VALUES (?,?,?)', [id, projectID, winnerID]);
    console.log("auction saved to DB successfully")
}

async function updateAuctionWinner(auctionID, userID) {
    await db.run('UPDATE Auctions SET winnerID = ? WHERE id = ?',
        userID,
        auctionID
    )
    console.log("auctionWinner updated in database successfully");
}

async function getAuctionsFullDBTable() {
    return await db.all('SELECT * FROM Auctions');
}

async function getAuctionProjectIDUsingAuctionId(auctionID) {
    let auctionProjectId =  await db.get('SELECT projectID FROM Auctions WHERE id = ?', [auctionID]);
    return auctionProjectId.projectID
}

async function getAuctionWinnerIDUsingAuctionId(auctionID) {
    let auctionWinnerId =  await db.get('SELECT winnerID FROM Auctions WHERE id = ?', [auctionID]);
    return auctionWinnerId.winnerID;
}

async function getNumberOfRowsInAuctionsTable() {
    let rowCounter = 0;
    await db.each('SELECT id FROM Auctions ',
        (err, row) => {
            rowCounter++;
            if (err) {
                throw err
            }
        }
    )
    return rowCounter;

}

/*************************************************SkillsDBFunctions***************************************************/
async function createSkillsTable() {
    await db.exec('CREATE TABLE Skills (id, skillName,skillPoint,accountID,projectID)');
    console.log("Skills DB created successfully");
}

async function saveAccountSkill(id, skillName, skillPoint, accountID) {
    await db.run('INSERT INTO Skills VALUES (?,?,?,?,?)', [id, skillName, skillPoint, accountID, -1]);
    console.log("account skill saved to DB successfully");
}

async function saveProjectSkill(id, skillName, skillPoint, projectID) {
    await db.run('INSERT INTO Skills VALUES (?,?,?,?,?)', [id, skillName, skillPoint, -1, projectID]);
    console.log("project skill saved to DB successfully");
}

async function updateAccountSkillPoint(skillID, skillPoint) {
    await db.run('UPDATE Skills SET skillPoint = ? WHERE id = ?',
        skillPoint,
        skillID
    )
    console.log("account skill updated in DB successfully");
}

async function getSkillsFullDBTable() {
    return await db.all('SELECT * FROM Skills')
}

async function getSkillNameUsingSkillId(skillID) {
    let skillName =  await db.get('SELECT skillName FROM Skills WHERE id = ?', [skillID]);
    return skillName.skillName;
}

async function getSkillPointUsingSkillId(skillID) {
    let skillPoint = await db.get('SELECT skillPoint FROM Skills WHERE id = ?', [skillID]);
    return skillPoint.skillPoint;
}

async function getSkillAccountIDUsingSkillId(skillID) {
    let skillAccountId =  await db.get('SELECT accountID FROM Skills WHERE id = ?', [skillID]);
    return skillAccountId.accountID;
}

async function getSkillProjectIDUsingSkillId(skillID) {
    let skillProjectId = await db.get('SELECT projectID FROM Skills WHERE id = ?', [skillID]);
    return skillProjectId.projectID;
}

async function getNumberOfRowsInSkillsTable() {
    let rowCounter = 0;
    await db.each('SELECT id FROM Skills ',
        (err, row) => {
            rowCounter++;
            if (err) {
                throw err
            }
        }
    )
    return rowCounter;

}

async function getSkillsOfAccountUsingAccountId(accountID) {
    return await db.all('SELECT id FROM Skills WHERE accountID = ? ',
        accountID)
}

async function getSkillsOfProjectUsingProjectId(projectID) {
    return await db.all('SELECT id FROM Skills WHERE projectID = ? ',
        projectID)
}

async function deleteSkillOfAccountUsingSkillName(skillId) {
    await db.run('DELETE FROM Skills WHERE id = ?', skillId);
    console.log("account skill removed from DB successfully");
}

async function getSkillIdUsingSkillNameAndAccountID(skillName, accountId) {
    let skillId =  await db.get('SELECT id FROM Skills WHERE skillName = ? and accountId = ?', [skillName, accountId])
    return skillId.id;
}

/*********************************************SkillConfirmationDBFunctions******************************************/
async function createConfirmationsTable() {
    await db.exec('CREATE TABLE Confirmations (id,skillId,sourceAccountId)');
    console.log("Confirmation DB created successfully");
}

async function saveConfirmation(id, skillId, sourceAccountID) {
    await db.run('INSERT INTO Confirmations VALUES (?,?,?)', [id, skillId, sourceAccountID]);
    console.log("confirmation added to DB successfully");
}

async function getConfirmationUsingSkillIdAndAccountId(skillId, sourceAccountID) {
    let confirmationId = await db.get('SELECT id FROM Confirmations WHERE  skillId = ? and sourceAccountId = ?',
        [skillId, sourceAccountID]);
    return confirmationId;

}

async function getNumberOfRowsInConfirmationTable() {
    let rowCounter = 0;
    await db.each('SELECT id FROM Confirmations ',
        (err, row) => {
            rowCounter++;
            if (err) {
                throw err
            }
        }
    )
    return rowCounter;

}

async function getConfirmationsFullDBTable() {
    return await db.all('SELECT * FROM Confirmations')
}

/****************************************************LoginFunctions****************************************************/
async function createLoginsTable(){
    await db.exec('CREATE TABLE Logins (id, userId, loginToken, loginTime)');
    console.log("Logins DB created successfully");
}

async function saveLogin(userId,loginToken,loginTime){
    let id = await getNumberOfRowsOfLoginsTable();
    await db.run('INSERT INTO Logins VALUES (?,?,?,?)', [id,userId,loginToken,loginTime]);
    console.log("login saved to DB successfully");
}

async function getNumberOfRowsOfLoginsTable() {
    let rowCounter = 0;
    await db.each('SELECT id FROM Logins ',
        (err, row) => {
            rowCounter++;
            if (err) {
                throw err
            }
        }
    )
    return rowCounter;

}
async function getLoginsFullDBTable() {
    return await db.all('SELECT * FROM Logins')
}

async function getLoginIdUsingToken(token){
    let loginId = await db.get('SELECT id FROM Logins WHERE loginToken = ?',[token]);
    if(!(loginId===undefined)) {
        return loginId.id;
    }
    else return undefined;
}
async function getAccountIdUsingToken(token){
    let accountId = await db.get('SELECT userId FROM Logins WHERE loginToken = ? ',[token]);
    return accountId.userId;
}
async function getLastLoginTokenId(accountId){
    let tokenId =  await db.get('SELECT id FROM Logins WHERE userId = ? ORDER BY loginTime DESC ',[accountId]);
    return tokenId.id;
}



module.exports = {
    createProjectsTable,
    saveProject,
    updateProjectAvailability,
    updateProjectAssignedAccountId,
    getProjectTitleUsingProjectId,
    getProjectBudgetUsingProjectId,
    getProjectDeadlineUsingProjectId,
    getProjectAvailabilityUsingProjectId,
    getProjectIDUsingProjectTitle,
    createBidsTable,
    saveBid,
    getBidsAmountUsingBidId,
    getBidIDUsingBidUsername,
    createAuctionsTable,
    saveAuction,
    updateAuctionWinner,
    createSkillsTable,
    saveAccountSkill,
    saveProjectSkill,
    updateAccountSkillPoint,
    getSkillsFullDBTable,
    getSkillNameUsingSkillId,
    getSkillPointUsingSkillId,
    getSkillAccountIDUsingSkillId,
    getSkillProjectIDUsingSkillId,
    getNumberOfRowsInProjectsTable,
    getNumberOfRowsInSkillsTable,
    getNumberOfRowsInAuctionsTable,
    getNumberOfRowsInBidsTable,
    deleteSkillOfAccountUsingSkillName,
    getSkillIdUsingSkillNameAndAccountID,
    getSkillsOfAccountUsingAccountId,
    getSkillsOfProjectUsingProjectId,
    getSkillIdUsingSkillNameAndAccountID,
    createConfirmationsTable,
    saveConfirmation,
    getConfirmationUsingSkillIdAndAccountId,
    getNumberOfRowsInConfirmationTable,
    getBidsOfProjectUsingProjectId,
    getBidsUserIDUsingBidId,
    getBidsProjectIdUsingBidId,
    getAuctionProjectIDUsingAuctionId,
    getAuctionWinnerIDUsingAuctionId,
    getProjectWinnerIDUsingProjectId,
    getAllProjectsAssignedToAnAccountUsingAccountId
    , getConfirmationsFullDBTable,
    db,
    getProjectsFullDBTable,
    getProjectByID,
    createLoginsTable,
    saveLogin,
    getLoginIdUsingToken,
    getAccountIdUsingToken,
    getLastLoginTokenId,
    getLoginsFullDBTable


}

