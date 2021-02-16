const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
let db;


//sample test to build the database
const projectClass = require("../Classes/Project");
let map_project1 = new Map([["C", "10"], ["C++", "20"]]);
let project1 = new projectClass(1, "tap30", map_project1, 400, [], new Date(2022, 3, 4, 0, 0, 0), true);
let map_project2 = new Map([["HTML", "10"], ["C++", "20"]]);
let project2 = new projectClass(2, "snap", map_project2, 8000, [], new Date(2022, 3, 4, 0, 0, 0), true);



// this is a top-level await
(async () => {
     db = await sqlite.open({
        filename: 'database.db',
        driver: sqlite3.Database
    })
    await db.exec('CREATE TABLE projects (id,title, skills, budget,deadline,isAvailable)')
    await db.run('INSERT INTO projects VALUES ("1","2","3","4","5","6")')
    console.log(await db.all('SELECT id FROM projects'))
    console.log(await db.all('SELECT title FROM projects'))
    console.log(await db.all('SELECT skills FROM projects'))
    console.log(await db.all('SELECT budget FROM projects'))
    console.log(await db.all('SELECT deadline FROM projects'))
    console.log(await db.all('SELECT isAvailable FROM projects'))


    // await console.log(db.get('SELECT id FROM projects'))
})()
function saveProjectInDB(id,title, skills, budget,deadline,isAvailable){

}

