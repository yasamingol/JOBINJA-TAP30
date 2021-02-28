const knex = require('knex')({
    client: 'sqlite',
    connection: {
        filename: './test.db',
    },
    useNullAsDefault: true
});


// Projects
knex.schema
    //Projects
    .createTable('Projects', table => {
        table.increments('id');
        table.string('title');
        table.integer('budget');
        table.string('deadline');
        table.boolean('isAvailable');
        table.integer('assignedAccountId')

    })
    //Auction
    .createTable('Auction', table => {
        table.increments('id');
        table.integer('projectID').references('Projects.id');
        table.integer('winnerID')
    })
    //Skill
    .createTable('Skills', table => {
        table.increments('id');
        table.string('skillName');
        table.integer('skillPoint');
        table.integer('accountID');
        table.integer('projectID').references('Projects.id');
    })
    //SkillConfirmation
    .createTable('Confirmations', table => {
        table.increments('id');
        table.integer('skillId').references('Skills.id');
        table.integer('sourceAccountId');
    })



    .then(() =>
        knex('Projects').insert({
            title: "tapsi",
            budget: 200,
            deadline: "2023/02/02",
            isAvailable: true,
            assignedAccountId: 0
        })
    )

    .then(() =>
        knex('Auction').insert({
            projectID:0,
            winnerID:0

        })
    )


    .then(() =>
        knex('Projects').select('Projects.id', 'Projects.title', 'Projects.budget',
            'Projects.deadline', 'Projects.isAvailable', 'Projects.assignedAccountId')
    )
    .then(rows => rows.map(row => {
            console.log(row)
        })
    )
    .then(() =>
        knex('Auction').select('Auction.id', 'Auction.projectID', 'Auction.winnerID',)
    )
    .then(rows => rows.map(row => {
            console.log(row)
        })
    )

    // Finally, add a .catch handler for the promise chain
    .catch(e => {
        console.error(e);
    });