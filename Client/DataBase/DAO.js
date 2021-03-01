const { Model } = require('objection');
const knex = require('/home/tapsi/IdeaProjects/concurency/knex.js')
Model.knex(knex);

class Project extends Model {
    static get tableName(){
        return 'Projects';
    }
    static get relationalMappings(){

    }

}



(async () => {
    const project =   await Project.query().where('id',0);
    console.log(project)

})()
