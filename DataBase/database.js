const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
let db;

// this is a top-level await
(async () => {
    db = await sqlite.open({
        filename: 'database.db',
        driver: sqlite3.Database
    })
    await createProjectsDB();
    await createAccountsDB();
    await createBidsDB();
    await createAuctionsDB();

})()
/************************************************ProjectsDBFunctions**************************************************/
function createProjectsDB() {
    db.exec('CREATE TABLE projects (id, title, budget,deadline,isAvailable,assignedAccountId)');
}

function saveProjectInDB(id, title, budget, deadline, isAvailable) {
    db.run('INSERT INTO projects VALUES (?,?,?,?,?,?)', [id, title, budget, deadline, isAvailable,-1]);
}

function updateProjectAvailabilityInDB(projectID) {
    db.run('UPDATE projects SET isAvailable = ? WHERE id = ?',
        false,
        projectID
    )
}
function updateProjectAssignedAccountIdInDB(projectID,accountID){
    db.run('UPDATE projects SET assignedAccountId = ? WHERE id = ?',
        accountID,
        projectID
    )
}

function getProjectsFullDBTable() {
    return db.all('SELECT * FROM projects')
}

function getProjectXTitleFromDB(projectID) {
    return db.get('SELECT title FROM projects WHERE id = ?', [projectID]);
}

function getProjectXBudgetFromDB(projectID) {
    return db.get('SELECT budget FROM projects WHERE id = ?', [projectID]);
}

function getProjectXDeadlineFromDB(projectID) {
    return db.get('SELECT deadline FROM projects WHERE id = ?', [projectID]);
}

function getProjectXIsAvailableFromDB(projectID) {
    return db.get('SELECT isAvailable FROM projects WHERE id = ?', [projectID]);
}

function getProjectIDUsingTitleFromDB(projectTitle) {
    return db.get('SELECT id FROM projects WHERE title = ?', [projectTitle])
}

/************************************************AccountsDBFunctions**************************************************/
function createAccountsDB(){
    db.exec('CREATE TABLE Accounts (id, username)');
}
function saveAccountInDB(id, username) {
    db.run('INSERT INTO Accounts VALUES (?,?)', [id, username]);
}
function getAccountsFullDBTable(){
    return db.all('SELECT * FROM Accounts');
}
function getAccountXUsernameFromDB(accountID){
    return db.get('SELECT username FROM Accounts WHERE id = ?', [accountID]);
}
function getAccountIDUsingUsernameFromDB(accountUsername){
    return db.get('SELECT id FROM Accounts WHERE username = ?', [accountUsername])

}
/************************************************BidsDBFunctions**************************************************/
//id,username, projectTitle, bidAmount
function createBidsDB(){
    db.exec('CREATE TABLE Bids (id, username,projectTitle,bidAmount)');
}
function saveBidInDB(id, username,projectTitle,bidAmount){
    db.run('INSERT INTO Bids VALUES (?,?,?,?)', [id, username,projectTitle,bidAmount]);
}
function getBidsFullDBTable(){
    return db.all('SELECT * FROM Bids');
}
function getBidXUsernameFromDB(bidID){
    return db.get('SELECT username FROM Bids WHERE id = ?', [bidID]);
}
function getBidXProjectTitleFromDB(bidID){
    return db.get('SELECT projectTitle FROM Bids WHERE id = ?', [bidID]);
}
function getBidXBidAmountFromDB(bidID){
    return db.get('SELECT bidAmount FROM Bids WHERE id = ?', [bidID]);
}
function getBidIDUsingUsernameFromDB(bidUsername){
    return db.get('SELECT id FROM Bids WHERE  username = ?', [bidUsername]);
}
/************************************************AuctionDBFunctions**************************************************/
function createAuctionsDB(){
    db.exec('CREATE TABLE Auctions (id, projectTitle, winnerUsername)');
}
function saveAuctionInDB(id, projectTitle, winnerUsername){
    db.run('INSERT INTO Auctions VALUES (?,?,?)', [id, projectTitle, winnerUsername]);
}
function updateAuctionWinnerInDB(auctionID,username){
    db.run('UPDATE Auctions SET winnerUsername = ? WHERE id = ?',
        username,
        auctionID
    )
}
function getAuctionsFullDBTable(){
    return db.all('SELECT * FROM Auctions');
}

function getAuctionXProjectTitleFromDB(auctionID){
    return db.get('SELECT projectTitle FROM Auctions WHERE id = ?', [auctionID]);
}
function getAuctionXWinnerFromDB(auctionID){
    return db.get('SELECT winnerUsername FROM Auctions WHERE id = ?', [auctionID]);
}
/*************************************************SkillsDBFunctions***************************************************/
function createSkillsDB(){
    db.exec('CREATE TABLE Skills (id, skillName,skillPoint,accountID,projectID)');
}
function saveAccountSkillInDB(id, skillName,skillPoint,accountID){
    db.run('INSERT INTO Skills VALUES (?,?,?,?,?)', [id, skillName,skillPoint,accountID,-1]);
}
function saveProjectSkillInDB(id, skillName,skillPoint,projectID){
    db.run('INSERT INTO Skills VALUES (?,?,?,?,?)', [id, skillName,skillPoint,-1,projectID]);
}
function updateAccountSkillPointInDB(skillID,skillPoint){
    db.run('UPDATE Skills SET skillPoint = ? WHERE id = ?',
        skillPoint,
        skillID
    )
}
function getSkillsFullDBTable(){
    return db.all('SELECT * FROM Skills')
}
function getSkillXSkillNameFromDB(skillID){
    return db.get('SELECT skillName FROM Skills WHERE id = ?', [skillID]);
}
function getSkillXSkillPointFromDB(skillID){
    return db.get('SELECT skillPoint FROM Skills WHERE id = ?', [skillID]);
}
function getSkillXAccountIDFromDB(skillID){
    return db.get('SELECT accountID FROM Skills WHERE id = ?', [skillID]);
}
function getSkillXProjectIDFromDB(skillID){
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
    getSkillXProjectIDFromDB

}