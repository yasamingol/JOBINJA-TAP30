
exports.up = function(knex,Promise) {
    return knex.schema.createTable('Auctions', t => {
        t.increments('id')
        t.integer('projectID')
        t.integer('winnerID')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('Auctions')
};
