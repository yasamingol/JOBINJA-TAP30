const axios = require('axios')
const controller = require('/home/tapsi/IdeaProjects/concurency/Client/Controller/Controller.js')
const Account = require('/home/tapsi/IdeaProjects/concurency/Client/Model/Classes/Account.js')

jest.mock('axios');

test('test getFullAccountById' ,() => {
    const accounts = [{username: 'yasamingol'}];
    const resp = {data: accounts};
    axios.get.mockResolvedValue(resp);

    return expect(controller.getFullAccountById(1)).toEqual(accounts)

})


//
// test('checking calculateUserSkill function - alis totalSkill should be ...', () => {
//     expect(controller.calculateUserSkill(bid2)).toBe(200330);
// })


// test('checking calculateBestBid function - the winner of tap30 should be yasamingol', () => {
//     expect(controller.calculateBestBid(project1)).toBe("yasamingol");
// })
//
// test('checking holdAuction function - the winner of tap30 should be yasamingol', () => {
//     expect(controller.holdAuction("tap30")).toBe("yasamingol");
// })
//
