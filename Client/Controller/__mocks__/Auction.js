const dao = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/DAO.js')

const projects = [{title: 'tapsi'},
    {title: 'snap'}];

export default {
    get: jest.fn(() => Promise.resolve(projects[0]))
}