const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
let db;

//base setup for the database
/************************************************ProjectsDBFunctions**************************************************/
function createProjectsDB(db) {
    db.exec('CREATE TABLE projects (id, title, budget,deadline,isAvailable,assignedAccountId)');
    console.log("projects DB created successfully");
}

function saveProjectInDB(db,id, title, budget, deadline, isAvailable) {
    db.run('INSERT INTO projects VALUES (?,?,?,?,?,?)', [id, title, budget, deadline, isAvailable,-1]);
    console.log("project added to DB successfully");
}

function updateProjectAvailabilityInDB(db,projectID) {
    db.run('UPDATE projects SET isAvailable = ? WHERE id = ?',
        false,
        projectID
    )
    console.log("project availability updated in DB successfully");
}
function updateProjectAssignedAccountIdInDB(db,projectID,accountID){
    db.run('UPDATE projects SET assignedAccountId = ? WHERE id = ?',
        accountID,
        projectID
    )
    console.log("project assignedAccount updated in DB successfully");

}

function getProjectsFullDBTable(db) {
    return db.all('SELECT * FROM projects')
}

function getProjectXTitleFromDB(db,projectID) {
    return db.get('SELECT title FROM projects WHERE id = ?', [projectID]);
}

function getProjectXBudgetFromDB(db,projectID) {
    return db.get('SELECT budget FROM projects WHERE id = ?', [projectID]);
}

function getProjectXDeadlineFromDB(db,projectID) {
    return db.get('SELECT deadline FROM projects WHERE id = ?', [projectID]);
}

function getProjectXIsAvailableFromDB(db,projectID) {
    return db.get('SELECT isAvailable FROM projects WHERE id = ?', [projectID]);
}

function getProjectIDUsingTitleFromDB(db,projectTitle) {
    return db.get('SELECT id FROM projects WHERE title = ?', [projectTitle])
}

/************************************************AccountsDBFunctions**************************************************/
function createAccountsDB(db){
    db.exec('CREATE TABLE Accounts (id, username)');
    console.log("Accounts DB created successfully");
}
function saveAccountInDB(db,id, username) {
    db.run('INSERT INTO Accounts VALUES (?,?)', [id, username]);
    console.log("account saved to DB successfully");
}
function getAccountsFullDBTable(db){
    return db.all('SELECT * FROM Accounts');
}
function getAccountXUsernameFromDB(db,accountID){
    return db.get('SELECT username FROM Accounts WHERE id = ?', [accountID]);
}
function getAccountIDUsingUsernameFromDB(db,accountUsername){
    return db.get('SELECT id FROM Accounts WHERE username = ?', [accountUsername])

}
/************************************************BidsDBFunctions**************************************************/
//id,username, projectTitle, bidAmount
function createBidsDB(db){
    db.exec('CREATE TABLE Bids (id, username,projectTitle,bidAmount)');
    console.log("Bids DB created successfully");
}
function saveBidInDB(db,id, username,projectTitle,bidAmount){
    db.run('INSERT INTO Bids VALUES (?,?,?,?)', [id, username,projectTitle,bidAmount]);
    console.log("bid saved to DB successfully")
}
function getBidsFullDBTable(db){
    return db.all('SELECT * FROM Bids');
}
function getBidXUsernameFromDB(db,bidID){
    return db.get('SELECT username FROM Bids WHERE id = ?', [bidID]);
}
function getBidXProjectTitleFromDB(db,bidID){
    return db.get('SELECT projectTitle FROM Bids WHERE id = ?', [bidID]);
}
function getBidXBidAmountFromDB(db,bidID){
    return db.get('SELECT bidAmount FROM Bids WHERE id = ?', [bidID]);
}
function getBidIDUsingUsernameFromDB(db,bidUsername){
    return db.get('SELECT id FROM Bids WHERE  username = ?', [bidUsername]);
}
/************************************************AuctionDBFunctions**************************************************/
function createAuctionsDB(db){
    db.exec('CREATE TABLE Auctions (id, projectTitle, winnerUsername)');
    console.log("Auctions DB created successfully");
}
function saveAuctionInDB(db,id, projectTitle, winnerUsername){
    db.run('INSERT INTO Auctions VALUES (?,?,?)', [id, projectTitle, winnerUsername]);
    console.log("auction saved to DB successfully")
}
function updateAuctionWinnerInDB(db,auctionID,username){
    db.run('UPDATE Auctions SET winnerUsername = ? WHERE id = ?',
        username,
        auctionID
    )
    console.log("auctionWinner updated in database successfully");
}
function getAuctionsFullDBTable(db){
    return db.all('SELECT * FROM Auctions');
}

function getAuctionXProjectTitleFromDB(db,auctionID){
    return db.get('SELECT projectTitle FROM Auctions WHERE id = ?', [auctionID]);
}
function getAuctionXWinnerFromDB(db,auctionID){
    return db.get('SELECT winnerUsername FROM Auctions WHERE id = ?', [auctionID]);
}
/*************************************************SkillsDBFunctions***************************************************/
function createSkillsDB(db){
    db.exec('CREATE TABLE Skills (id, skillName,skillPoint,accountID,projectID)');
    console.log("Skills DB created successfully");
}
function saveAccountSkillInDB(db,id, skillName,skillPoint,accountID){
    db.run('INSERT INTO Skills VALUES (?,?,?,?,?)', [id, skillName,skillPoint,accountID,-1]);
    console.log("account skill saved to DB successfully");
}
function saveProjectSkillInDB(db,id, skillName,skillPoint,projectID){
    db.run('INSERT INTO Skills VALUES (?,?,?,?,?)', [id, skillName,skillPoint,-1,projectID]);
    console.log("project skill saved to DB successfully");
}
function updateAccountSkillPointInDB(db,skillID,skillPoint){
    db.run('UPDATE Skills SET skillPoint = ? WHERE id = ?',
        skillPoint,
        skillID
    )
    console.log("account skill updated in DB successfully");
}
function getSkillsFullDBTable(db){
    return db.all('SELECT * FROM Skills')
}
function getSkillXSkillNameFromDB(db,skillID){
    return db.get('SELECT skillName FROM Skills WHERE id = ?', [skillID]);
}
function getSkillXSkillPointFromDB(db,skillID){
    return db.get('SELECT skillPoint FROM Skills WHERE id = ?', [skillID]);
}
function getSkillXAccountIDFromDB(db,skillID){
    return db.get('SELECT accountID FROM Skills WHERE id = ?', [skillID]);
}
function getSkillXProjectIDFromDB(db,skillID){
    return db.get('SELECT projectID FROM Skills WHERE id = ?', [skillID]);
}


module.exports = {createProjectsDB,saveProjectInDB,updateProjectAvailabilityInDB,
    updateProjectAssignedAccountIdInDB,getProjectsFullDBTable,getProjectXTitleFromDB,
    getProjectXBudgetFromDB,getProjectXDeadlineFromDB,getProjectXIsAvailableFromDB,
    getProjectIDUsingTitleFromDB,createAccountsDB,saveAccountInDB,getAccountsFullDBTable,
    getAccountXUsernameFromDB,getAccountIDUsingUsernameFromDB,createBidsDB,saveBidInDB,
    getBidsFullDBTable,getBidXUsernameFromDB,getBidXProjectTitleFromDB,getBidXBidAmountFromDB,
    getBidIDUsingUsernameFromDB,createAuctionsDB,saveAuctionInDB,updateAuctionWinnerInDB,
    getAuctionsFullDBTable,getAuctionXProjectTitleFromDB,getAuctionXWinnerFromDB,
    createSkillsDB,saveAccountSkillInDB,saveProjectSkillInDB,updateAccountSkillPointInDB,
    getSkillsFullDBTable,getSkillXSkillNameFromDB,getSkillXSkillPointFromDB,getSkillXAccountIDFromDB,
    getSkillXProjectIDFromDB,db

}