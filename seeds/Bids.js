exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('Bids').del()
        .then(function () {
            // Inserts seed entries
            return knex('Bids').insert([
                {
                    userId:0,
                    projectId:1,
                    bidAmount:5,
                }
            ]);
        });
};
