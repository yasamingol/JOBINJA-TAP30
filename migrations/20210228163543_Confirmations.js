
exports.up = function(knex,Promise) {
    return knex.schema.createTable('Confirmations', t => {
        t.increments('id')
        t.integer('skillId')
        t.integer('sourceAccountId')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('Confirmations')

};
