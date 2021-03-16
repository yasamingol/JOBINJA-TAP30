// const dao = require('/home/tapsi/IdeaProjects/concurency/Client/DataBase/DAO.js')
const controller = require('/home/tapsi/IdeaProjects/concurency/Client/Controller/Controller.js')
const Bid = require('/home/tapsi/IdeaProjects/concurency/Client/Model/Classes/Bid.js')

const Project = require('../../Model/Classes/Project')
const Account = require('../../Model/Classes/Account')




test('testing calculateUserSkill operations - all other functions mocked', async () => {
    const bid = new Bid(1, 1, 1, 12);
    const skills1 = new Map();
    skills1.set("C", 20);
    const skills2 = new Map();
    skills2.set("C", 30);
    controller.buildFullProjectByGettingID = await jest.fn().mockResolvedValue(new Project(1, 'tapsi', skills1, 200, "2025/03/02", true, -1))
    controller.buildFullAccountByGettingID = await jest.fn().mockResolvedValue(new Account(1, 'yasamingol', '2431380', skills2, null, null))
    let result = await controller.calculateUserSkill(bid);
    expect(result).toEqual(100188);
});



test('testing calculateBestBid', async () => {
    const bid1 = new Bid(1,1,1,500);
    const bid2 = new Bid(2,2,1,600);
    let listOfBids = [bid1,bid2];
    const skills1 = new Map();
    skills1.set("C", 20);
    const skills2 = new Map();
    skills2.set("C", 30);
    controller.buildFullBidUsingBidID = await jest.fn().mockResolvedValueOnce(bid1).mockResolvedValueOnce(bid2)
    controller.calculateUserSkill = await jest.fn().mockResolvedValueOnce(5000).mockResolvedValueOnce(100000);
    let result = await controller.calculateToFindTheBestBid(listOfBids);
    expect(result).toEqual(2);


})








