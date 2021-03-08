const dao = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/DAO.js')
const controller = require('/home/tapsi/IdeaProjects/concurency/Client/Controller/Controller.js')
const Bid = require('/home/tapsi/IdeaProjects/concurency/Client/Model/Classes/Bid.js')
const bid = new Bid(1, 1, 1, 12);
const Project = require('../../Model/Classes/Project')
const Account = require('../../Model/Classes/Account')

//mockings...


// dao.getProjectById = jest.fn().mockResolvedValue({id:1, title:"tapsi", budget:200, deadline:"2025/03/02",isAvailable:true ,assignedAccountId:-1 });
// dao.getProjectSkills = jest.fn().mockResolvedValue({skillName:"C", skillPoint:20, accountID:-1, projectID:1});
// dao.getSkillById = jest.fn().mockResolvedValueOnce({skillName:"C", skillPoint:20, accountID:-1, projectID:1})
//     .mockResolvedValueOnce({skillName:"C", skillPoint:200, accountID:1, projectID:-1});
// controller.getFullAccountById = jest.fn().mockResolvedValue({id:1, username:"yasamingol", password:'2431380'});
// dao.getAccountSkills = jest.fn().mockResolvedValue({skillName:"C", skillPoint:200, accountID:1, projectID:-1});
// dao.getAllProjectsAssignedToAnAccountUsingAccountId = jest.fn().mockResolvedValue({});
// dao.getBidsOfProjectByProjectId = jest.fn().mockResolvedValue({id:1, userId:1, projectId:1, bidAmount:12});



test('test buildFullProjectByGettingID', async () => {
    let project = await controller.buildFullProjectByGettingID(1);
    expect(project.skills).toEqual({skillName: "C", skillPoint: 20, accountID: -1, projectID: 1})
})


test('test getFullAccount', async () => {
    let account = await controller.getFullAccountById(1);
    expect(account.username).toEqual('yasamingol')
})


test('can view full project by id', async () => {
    let project = await dao.getProjectById(1);
    expect(project.title).toEqual("tapsi")
});


test('calculate userSkill', async () => {
    // jest.mock('knex');
    const skills1 = new Map();
    skills1.set("C", 20);
    const skills2 = new Map();
    skills2.set("C", 30);
    controller.buildFullProjectByGettingID = await jest.fn().mockResolvedValue(new Project(1, 'tapsi', skills1, 200, "2025/03/02", true, -1))
    controller.buildFullAccountByGettingID = await jest.fn().mockResolvedValue(new Account(1, 'yasamingol', '2431380', skills2, null, null))
    let result = await controller.calculateUserSkill(bid);
    console.log(result)
});







