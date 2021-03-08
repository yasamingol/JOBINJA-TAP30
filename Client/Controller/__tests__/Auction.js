jest.mock('knex');
const dao = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/DAO.js')


    it('can view full project by id', () => {
        dao.getProjectById = jest.fn().mockResolvedValueOnce({title:"tapsi",budget:200}).mockResolvedValueOnce({title:"snap",budget:50})
        console.log(dao.getProjectById(1))
        console.log(dao.getProjectById(1))


        // try {
        //     const project = dao.getProjectById(1);
        //     console.log(project);
        // }catch (e) {
        //     console.log(e)
        // }

    });


