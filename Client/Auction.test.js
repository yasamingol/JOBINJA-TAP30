const clientClass = require("./Controller/Client-Controller");
const accountClass = require("./Model/Classes/Account");
const projectClass = require("./Model/Classes/Project");
const bidClass = require("./Model/Classes/Bid");

//building bids :
let bid1 = new bidClass(1, "yasamingol", "tap30", 80);
let bid2 = new bidClass(2, "ali", "tap30", 70);

//building accounts :
let map_account1 = new Map([["C", "50"], ["C++", "100"]]);
let account1 = new accountClass(1, "yasamingol", map_account1, [], []);
let map2_account2 = new Map([["C", "20"], ["C++", "30"]]);
let account2 = new accountClass(2, "ali", map2_account2, [], []);
let map3_account3 = new Map([["HTML", "20"], ["C++", "30"]]);
let account3 = new accountClass(3, "reza", map3_account3, [], []);
let map4_account4 = new Map([["C", "2"], ["C++", "89"]]);
let account4 = new accountClass(4, "sam", map4_account4, [], []);

//building projects :
let map_project1 = new Map([["C", "10"], ["C++", "20"]]);
let project1 = new projectClass(1, "tap30", map_project1, 400, [bid1, bid2], new Date(2022, 3, 4, 0, 0, 0), true);
let map_project2 = new Map([["HTML", "10"], ["C++", "20"]]);
let project2 = new projectClass(2, "snap", map_project2, 8000, [], new Date(2022, 3, 4, 0, 0, 0), true);



test('checking calculateUserSkill function - alis totalSkill should be ...', () => {
    expect(clientClass.calculateUserSkill(bid2)).toBe(200330);
})

test('checking calculateBestBid function - the winner of tap30 should be yasamingol', () => {
    expect(clientClass.calculateBestBid(project1)).toBe("yasamingol");
})

test('checking holdAuction function - the winner of tap30 should be yasamingol', () => {
    expect(clientClass.holdAuction("tap30")).toBe("yasamingol");
})

