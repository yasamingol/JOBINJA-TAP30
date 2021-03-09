
exports.up = function(knex,Promise) {
    return knex.schema.createTable('Skills', t => {
        t.increments('id')
        t.string('skillName')
        t.integer('skillPoint')
        t.integer('accountID')
        t.integer('projectID')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('Skills')

};
