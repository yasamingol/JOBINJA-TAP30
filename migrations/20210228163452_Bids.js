
exports.up = function(knex,Promise) {
    return knex.schema.createTable('Bids',t => {
        t.increments('id')
        t.integer('userId')
        t.integer('projectId')
        t.integer('bidAmount')
    })
};
//d, userId,projectId,bidAmount
exports.down = function(knex) {
    return knex.schema.dropTable('Bids')
};
