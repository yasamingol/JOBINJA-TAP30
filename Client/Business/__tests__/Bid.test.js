



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
