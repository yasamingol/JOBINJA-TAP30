exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('Auctions').del()
        .then(function () {
            // Inserts seed entries
            return knex('Auctions').insert([
                {
                    projectID:10,
                    winnerID:0
                }
            ]);
        });
};
