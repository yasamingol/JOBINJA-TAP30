exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('Skills').del()
        .then(function () {
            // Inserts seed entries
            return knex('Skills').insert([
                // {
                //     skillName: "C",
                //     skillPoint: 20,
                //     accountID: 1,
                //     projectID: null,
                // },
                // {
                //     skillName: "CSS",
                //     skillPoint: 90,
                //     accountID: 1,
                //     projectID: -1,
                // },
                {
                    skillName: "C",
                    skillPoint: 9,
                    accountID: -1,
                    projectID: 1,
                }
            ]);
        });
};
