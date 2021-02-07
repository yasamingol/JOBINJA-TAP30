/**********************************************Classes************************************************************/
//need to convert this tp a static field for account class
let allAccounts = [];
class Account {
    constructor(username, skills) {
        this.username = username;
        this.skills = skills;
        allAccounts[allAccounts.length] = this;

    }
}




/***********************************************Menus*************************************************************/

const prompt = require('prompt-sync')();
console.log("Welcome to JobInja!")

let commandIsValid = false;
while (!commandIsValid) {
    console.log(" 1.register \n 2.addProjecct \n 3.bid \n 4.auction \n 5.exit");
    const selectedMenu = prompt("Please enter the menu number you want to enter : ");

    if (selectedMenu === "1") {
        let arr = [];
        let username = arr[1];
        let skills = new Map;

        console.log("\nWelcome to Register_Menu! You can create a new account using : register <user_info> ");
        const command = prompt("");
        arr = command.split(" ");
        for (let i = 2; i < arr.length; i++) {
            let arrSkiles = [];
            arrSkiles = arr[i].split(":");
            skills.set(arrSkiles[0], arrSkiles[1]);

        }
        new Account(username, skills);


        console.log("registered successfully!\n");


    }

    else if (selectedMenu === "2") {
        console.log("welcome to  addProject menu!\nyou can add a new project using : addProject <project_info>");

    }
    else if (selectedMenu === "3") {
        console.log("welcome to  bid menu!\nyou can add a new bid using : bid <bid_info>");

    }
    else if (selectedMenu === "4") {
        console.log("welcome to  auction menu!\nyou can end auction using : auction <project_identifier>");

    }
    else if(selectedMenu === "5"){
        console.log("exit");
        commandIsValid = true;
    }
    else console.log("command is invalid! try again")


}
console.log(allAccounts);


