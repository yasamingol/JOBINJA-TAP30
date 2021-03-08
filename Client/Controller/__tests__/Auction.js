jest.mock('knex');
const dao = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/DAO.js')


    it('can view full project by id', () => {
        dao.getProjectById = jest.fn().mockResolvedValueOnce({title:"tapsi",budget:200})
        let project = dao.getProjectById(1);
        project.then(function (result){
           console.log('result',result)
        })


        // try {
        //     const project = dao.getProjectById(1);
        //     console.log(project);
        // }catch (e) {
        //     console.log(e)
        // }

    });


