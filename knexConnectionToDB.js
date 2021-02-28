let environment = process.env.NODE_ENV || 'development'
let config = require('/home/tapsi/IdeaProjects/concurency/knexfile.js')[environment]

module.exports = require('knex')(config)