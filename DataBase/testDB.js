const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
(async () => {
    db = await sqlite.open({
        filename: 'database.db',
        driver: sqlite3.Database
    })
    await db.exec('CREATE TABLE tbl (col TEXT)')
    await db.exec('INSERT INTO tbl VALUES ("test")')
    await db.run(
        'INSERT INTO tbl (col) VALUES (?)',
        'foo'
    )
    console.log(await db.all('SELECT col FROM tbl'))

})()