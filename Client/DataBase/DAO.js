const {Model} = require('objection');
const knex = require('/home/tapsi/IdeaProjects/concurency/knex.js')
Model.knex(knex);

/*****************************************************Project*********************************************************/
class Project extends Model {
    static get tableName() {
        return 'Projects';
    }

    static get relationalMappings() {

    }

}

/******************************************************Skill**********************************************************/
class Skill extends Model {
    static get tableName() {
        return 'Skills';
    }

    static get relationalMappings() {
        // const Project = require('./Project');
        return {
            projectID: {
                relation: Model.HasOneRelation,
                modelClass: Project,
                join: {
                    from: 'Skills.projectID',
                    to: 'Projects.id'
                }
            }

        }
    }

}

/*****************************************************Auction*********************************************************/
class Auction extends Model {
    static get tableName() {
        return 'Skills';
    }

    static get relationalMappings() {
        // const Project = require('./Project');
        return {
            projectID: {
                relation: Model.HasOneRelation,
                modelClass: Project,
                join: {
                    from: 'Auctions.projectID',
                    to: 'Projects.id'
                }
            }
        }
    }

}

/*******************************************************Bid***********************************************************/
class Bid extends Model {
    static get tableName() {
        return 'Skills';
    }

    static get relationalMappings() {
        // const Project = require('./Project');
        return {
            projectID: {
                relation: Model.HasOneRelation,
                modelClass: Project,
                join: {
                    from: 'Bids.projectID',
                    to: 'Projects.id'
                }
            }

        }
    }
}

/**************************************************Confirmation*******************************************************/

class Confirmation extends Model {
    static get tableName() {
        return 'Skills';
    }

    static get relationalMappings() {
        // const Skill = require('./Skill');
        return {
            projectID: {
                relation: Model.HasOneRelation,
                modelClass: Skill,
                join: {
                    from: 'Skills.id',
                    to: 'Confirmations.skillId'
                }
            }

        }
    }
}


/*************************************************Query-Functions*****************************************************/

async function getProjectsSkills(projectId){
    const skills = await Skill.query().where('projectID',projectId);
    return skills
}

(async () => {
    console.log(await getProjectsSkills(0))

})()

