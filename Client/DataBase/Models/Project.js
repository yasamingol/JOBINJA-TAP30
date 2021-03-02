const {Model} = require('objection');
const knex = require('/home/tapsi/IdeaProjects/concurency/knex.js')
Model.knex(knex);


class Project extends Model {
    static get tableName() {
        return 'Projects';
    }

    static get relationalMappings() {

    }

}



module.exports = Project
