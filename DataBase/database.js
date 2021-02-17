const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
let db;


//sample test to build the database
const projectClass = require("../Classes/Project");
let map_project1 = new Map([["C", "10"], ["C++", "20"]]);
let project1 = new projectClass(1, "tap30", map_project1, 400, [], new Date(2022, 3, 4, 0, 0, 0), true);


// this is a top-level await
(async () => {
    db = await sqlite.open({
        filename: 'database.db',
        driver: sqlite3.Database
    })
    await db.exec('CREATE TABLE projects (id, title, budget,deadline,isAvailable)');
    await saveProjectInDB(project1.id, project1.title, project1.budget, project1.deadline, project1.isAvailable)
    console.log(await getProjectIDUsingTitleFromDB("tap30"));



})()

function saveProjectInDB(id, title, budget, deadline, isAvailable) {
   db.run('INSERT INTO projects VALUES (?,?,?,?,?)', [id, title, budget, deadline, isAvailable]);
}
function getProjectsFullDBTable(){
    return db.all('SELECT * FROM projects')
}
function getProjectXTitleFromDB(projectID){
    return db.get('SELECT title FROM projects WHERE id = ?', [projectID]);
}
function getProjectXBudgetFromDB(projectID){
    return db.get('SELECT budget FROM projects WHERE id = ?', [projectID]);
}
function getProjectXDeadlineFromDB(projectID){
    return db.get('SELECT deadline FROM projects WHERE id = ?', [projectID]);
}
function getProjectXIsAvailableFromDB(projectID){
    return db.get('SELECT isAvailable FROM projects WHERE id = ?', [projectID]);
}
function getProjectIDUsingTitleFromDB(projectTitle){
    return db.get('SELECT id FROM projects WHERE title = ?', [projectTitle])
}



