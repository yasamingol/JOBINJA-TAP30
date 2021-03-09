exports.up = function(knex,Promise) {
  return knex.schema.createTable('Projects',t => {
      t.increments('id')
      t.string('title').unique()
      t.integer('budget')
      t.date('deadline')
      t.boolean('isAvailable')
      t.integer('assignedAccountId')
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable('Projects')
};
