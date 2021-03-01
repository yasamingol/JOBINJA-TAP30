const { Model } = require('objection');
const knex = require('/home/tapsi/IdeaProjects/concurency/knex.js')

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

