
const project = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/Models/Project');

(async () => {
    console.log(await project.query())

})()