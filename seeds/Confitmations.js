
exports.seed = function(knex,Promise) {
  // Deletes ALL existing entries
  return knex('Confirmations').del()
    .then(function () {
      // Inserts seed entries
      return knex('Confirmations').insert([
        {}
      ]);
    });
};
