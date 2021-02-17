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
    await db.exec('CREATE TABLE projects (id,title, skills, budget,deadline,isAvailable)');
    await saveProjectInDB(project1.id, project1.title, project1.skills, project1.budget, project1.title, project1.isAvailable)
    console.log(await db.all('SELECT * FROM projects'))


})()

function saveProjectInDB(id, title, skills, budget, deadline, isAvailable) {
   db.run('INSERT INTO projects VALUES (?,?,?,?,?,?)', [id, title, skills, budget, deadline, isAvailable]);

}
