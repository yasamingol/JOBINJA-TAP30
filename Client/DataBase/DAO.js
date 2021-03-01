const { Model } = require('objection');
const knex = require('/home/tapsi/IdeaProjects/concurency/knex.js')
Model.knex(knex);

/*****************************************************Project*********************************************************/
class Project extends Model {
    static get tableName(){
        return 'Projects';
    }
    static get relationalMappings(){

    }

}


/******************************************************Skill**********************************************************/
class Skill extends Model {
    static get tableName(){
        return 'Skills';
    }
    static get relationalMappings(){
        const Project = require('./Project');
        return{
            projectID:{
                relation: Model.HasOneRelation,
                modelClass:Project,
                join:{
                    from: 'Skills.projectID',
                    to:'Projects.id'
                }
            }

        }
    }

}
/*****************************************************Auction*********************************************************/
class Auction extends Model {

}
/*******************************************************Bid***********************************************************/
class Bid extends Model {

}
/**************************************************Confirmation*******************************************************/

class Confirmation extends Model {

}


/*************************************************Query-Functions*****************************************************/
(async () => {
    const project =   await Project.query().where('id',0);
    console.log(project)

})()
