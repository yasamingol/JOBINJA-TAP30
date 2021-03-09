
exports.seed = function(knex,Promise) {
  // Deletes ALL existing entries
  return knex('Projects').del()
    .then(function () {
      // Inserts seed entries
      return knex('Projects').insert([
        {
            title:"tapsi",
            budget:200,
            deadline:'2022-03-04',
            isAvailable:true,
            assignedAccountId:null
        },
          {
              title:"snap",
              budget:100,
              deadline:'2023-03-04',
              isAvailable:true,
              assignedAccountId:null
          },
      ]);
    });
};

