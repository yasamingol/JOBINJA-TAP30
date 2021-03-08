jest.mock('knex');
jest.mock('axios');
const dao = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/DAO.js')
const controller = require('/home/tapsi/IdeaProjects/concurency/Client/Controller/Controller.js')
const Bid = require('/home/tapsi/IdeaProjects/concurency/Client/Model/Classes/Bid.js')


//mockings...
dao.getProjectById = jest.fn().mockResolvedValue({id:1, title:"tapsi", budget:200, deadline:"2025/03/02",isAvailable:true ,assignedAccountId:-1 })
dao.getProjectSkills = jest.fn().mockResolvedValue({skillName:"C", skillPoint:20, accountID:-1, projectID:1});
dao.getSkillById = jest.fn().mockResolvedValueOnce({skillName:"C", skillPoint:20, accountID:-1, projectID:1})
    .mockResolvedValueOnce({skillName:"C", skillPoint:200, accountID:1, projectID:-1});

controller.getFullAccountById = jest.fn().mockResolvedValue({id:1, username:"yasmingol", password:'2431380'});
dao.getAccountSkills = jest.fn().mockResolvedValue({skillName:"C", skillPoint:200, accountID:1, projectID:-1});
dao.getAllProjectsAssignedToAnAccountUsingAccountId = jest.fn().mockResolvedValue({});
dao.getBidsOfProjectByProjectId = jest.fn().mockResolvedValue({id:1, userId:1, projectId:1, bidAmount:12})


//userId: bid.userID,
//             projectId: bid.projectID,
//             bidAmount: bid.bidAmount
const bid = new Bid(1,1,1,12);



test('can view full project by id', async () => {
    let project = await dao.getProjectById(1);
    expect(project.title).toEqual("tapsi")
});


test('calculate userSkill',async () => {
    jest.mock('knex');
    let result = await controller.calculateUserSkill(bid);
    result.then(function (result){
        console.log(result);

    })

})




