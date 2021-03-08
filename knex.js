let environment = process.env.NODE_ENV || 'development'
let config = require('/home/tapsi/IdeaProjects/concurency/knexfile.js')['development']

module.exports = require('knex')(config)