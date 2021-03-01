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
//projects functions
async function saveProject(title, budget, deadline, isAvailable, assignedAccountId) {
    await Project.query().insert(
        {
            title: title,
            budget: budget,
            deadline: deadline,
            isAvailable: isAvailable,
            assignedAccountId: assignedAccountId
        })
    console.log("project saved successfully!")
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
//Skill
async function saveAccountSkill(skillName,skillPoint,accountId){
    await Skill.query().insert(
        {
            skillName: skillName,
            skillPoint: skillPoint,
            accountID: accountId,
            projectID: -1
        }
    )
    console.log("accountSkill saved successfully!")
}
async function saveProjectSkill(skillName,skillPoint,projectId){
    await Skill.query().insert(
        {
            skillName: skillName,
            skillPoint: skillPoint,
            accountID: -1,
            projectID: projectId
        }
    )
    console.log("projectSkill saved successfully!")
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
async function saveAuction(projectId,winnerId){
    await Auction.query().insert(
        {
            projectID:projectId,
            winnerID:winnerId
        }
    )
    console.log("auction saved successfully!")
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

// Bids functions
async function saveBid(userId,projectId,bidAmount){
    await Bid.query().insert(
        {
            userID: userId,
            projectID: projectId,
            bidAmount: bidAmount
        }
    )
    console.log("bid saved successfully!")
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

//Confirmation
async function saveConfirmation(skillId,sourceAccountId){
    await Confirmation.query().insert(
        {
            skillId: skillId,
            sourceAccountId: sourceAccountId
        }
    )
    console.log("confirmation saved successfully!")
}

/*********************************************Query-Functions-Test***************************************************/

(async () => {
    await saveProject("karpino",400,"2025/03/01",true,null)
})()

