
class Account {
    static  allAccounts = [];
    constructor(id,username, skills,asignedProjectList,skillConfirmationList) {
        this.id = id;
        this.username = username;
        this.skills = skills;
        this.asignedProjectList = asignedProjectList;
        this.skillConfirmationList = skillConfirmationList;
        Account.allAccounts[Account.allAccounts.length] = this;
    }

    static getAccountByUsername(username) {
            for (let i = 0; i < Account.allAccounts.length; i++) {
                if (Account.allAccounts[i].username === username) {
                    return Account.allAccounts[i];
                }
            }
            console.log("this user does not exist");
        }

}
module.exports = Account;



