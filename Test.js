let allCommands = [];
const fs = require('fs');
const readline = require('readline');
const file = readline.createInterface({
    input: fs.createReadStream("/home/tapsi/IdeaProjects/concurency/testCases"),
    output: process.stdout,
    terminal: false
});

file.on('line', (line) => {
    allCommands[allCommands.length] = line;

});

