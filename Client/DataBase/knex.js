const knex = require('knex')({
    client: 'sqlite',
    connection: {
        filename: './testDB.db',
    },
    useNullAsDefault : true
});


// Projects
knex.schema
    .createTable('Projects', table => {
        table.increments('id');
        table.string('title');
        table.integer('budget');
        table.string('deadline');
        table.boolean('isAvailable');
        table.integer('assignedAccountId')

    })

    .then(() =>
        knex('Projects').insert({title:"tapsi", budget:200, deadline:"2023/02/02", isAvailable:true, assignedAccountId:0})
    )
    //id, title, budget,deadline,isAvailable,assignedAccountId, budget,deadline,isAvailable,assignedAccountId
    .then(() =>
        knex('Projects').select('Projects.id','Projects.title','Projects.budget',
            'Projects.deadline', 'Projects.isAvailable', 'Projects.assignedAccountId')
    )

    .then(rows => rows.map(row => {
        console.log(row)
    })
    )


    // Finally, add a .catch handler for the promise chain
    .catch(e => {
        console.error(e);
    });