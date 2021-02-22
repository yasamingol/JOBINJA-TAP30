const clientClass = require("./Controller/Controller");
const accountClass = require("./Model/Classes/Account");
const projectClass = require("./Model/Classes/Project");


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
let project1 = new projectClass(1, "tap30", map_project1, 400, [], new Date(2022, 3, 4, 0, 0, 0), true);
let map_project2 = new Map([["HTML", "10"], ["C++", "20"]]);
let project2 = new projectClass(2, "snap", map_project2, 8000, [], new Date(2022, 3, 4, 0, 0, 0), true);




test('checking checkIfSkilledEnoughenough to bid - ali should be skilled enough',() => {
    expect(clientClass.checkIfSkilledEnough("ali","tap30")).toBe(true);
})
test('checking checkIfSkilledEnough to bid - check containing all skills - reza doesnt have all of the requirements',() => {
    expect(clientClass.checkIfSkilledEnough("reza","tap30")).toBe(false);
})
test('checking checkIfSkilledEnough enough to bid - check having enough points - reza doesnt have enough points',() => {
    expect(clientClass.checkIfSkilledEnough("sam","tap30")).toBe(false);
})
test('checking checkIfBidEnough function - 300<400 bid should be enough', () => {
    expect(clientClass.checkIfBidEnough("tap30",300)).toBe(true);
})
