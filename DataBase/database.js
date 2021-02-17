const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
let db;


//sample test to build the database
const accountClass = require("../Classes/Account");
const projectClass = require("../Classes/Project");
let map_project1 = new Map([["C", "10"], ["C++", "20"]]);
let project1 = new projectClass(1, "tap30", map_project1, 400, [], new Date(2022, 3, 4, 0, 0, 0), true);
let account1 = new accountClass(1, "yasamingol", map_project1, [], []);


// this is a top-level await
(async () => {
    db = await sqlite.open({
        filename: 'database.db',
        driver: sqlite3.Database
    })
    await createProjectsDB();
    await saveProjectInDB(project1.id, project1.title, project1.budget, project1.deadline, project1.isAvailable)
    await createAccountsDB();
    await saveAccountInDB(account1.id,account1.username);
    await createBidsDB();
    await saveBidInDB(1,"yasamingol","tap30",34567);
    await createAuctionsDB();
    await saveAuctionInDB(1,"top30","yasamingol");
    console.log(await getAuctionsFullDBTable());
    console.log(await getBidsFullDBTable())
    console.log(await getProjectsFullDBTable())
    console.log(await getAccountsFullDBTable())
})()
/************************************************ProjectsDBFunctions**************************************************/
function createProjectsDB() {
    db.exec('CREATE TABLE projects (id, title, budget,deadline,isAvailable)');
}

function saveProjectInDB(id, title, budget, deadline, isAvailable) {
    db.run('INSERT INTO projects VALUES (?,?,?,?,?)', [id, title, budget, deadline, isAvailable]);
}

function updateProjectAvailabilityInDB(projectID) {
    db.run('UPDATE projects SET isAvailable = ? WHERE id = ?',
        false,
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