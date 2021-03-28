const messages = {

    WelcomToJobinja: "Welcome to JobInja!".red,

    AvailableMenus: "\n MENUS : ".cyan + "\n 1.view all projects \n 2.view available projects \n 3.view project by id " +
        "\n 4.view all accounts \n 5.view account by id \n 6.bid on a project " +
        "\n 7.confirmSkills \n 8.addSkill \n 9.removeSkill \n 10.register \n 11.addProject \n 12.holdAuction" +
        " \n 13.login \n 14.exit \n Please enter the menu number you want to enter : ",

    WelcomeToRegisterMenu: "Welcome to ((register)) menu!".cyan + "command : register <username> <password> <skill:point>".green,

    SkillAddedSuccessfully: "skill added successfully".green,

    SkillIsInValid: "skill is invalid".red,

    RegisteredSuccessfully: "registered successfully!\n".green,

    WelcomeToLoginMenu: "\nwelcome to Login menu!\n you can login: " + "login <username> <password>".green,

    LoginSuccessfully: "login successfully! your loginToken : ".green,

    IncorrectPassword: "incorrect password! please try again.".red,

    WelcomeToAddProjectMenu: "\nwelcome to  addProject menu!\nyou can add a new project using : "
        + "addProject <projectTitle> <skill:rate> <budget> <deadline(year/month/day)> <token>".green,

    ProjectBuiltSuccessfully: "project built successfully!\n".green,

    ViewAllProjectsMenu: "\n View all projects menu : ".cyan + "<token>".green,

    WelcomeToViewAvailableProjectsMenu: "\nWelcome to ((view available projects)) menu!".cyan + " command : <username> <token>".green,

    NoProjectIsAvailableError: "There are no projects available for you now!".red,

    WelcomeToViewProjectMenu: "\nWelcome to ((view project)) menu!".cyan + "command : <project-id> <token>".green,

    ViewAllAccountsMenu: "\nView all accounts menu".cyan + "<token>".green,

    WelcomeToViewAccountMenu: "Welcome to ((view account)) menu!".cyan + "command : <account-id> <token>".green,

    WelcomeToConfirmSkillMenu: "\nwelcome to confirmSkill menu!\nyou can confirm a skill using" +
        "confirmSkill <your_username> <other_username> <skill> <token>".green,

    SkillHasBeenConfirmedBeforeError: "cannot confirm this skillSet! you have done it once before!".red,

    WelcomeToAddSkillMenu: "\nwelcome to addSkill menu!\nyou can add a skill using" + "addSkill <username> <skill:rate> <token>".green,

    SkillAddedSuccessfully: "skill added successfully!\n".green,

    SkillDoesNotExistError: "such skill does not exist!".red,

    WelcomeToRemoveSkillMenu: "\nwelcome to removeSkill menu!\nyou can remove a skill using"
        + "removeSkill <username> <skill> <token>".green,

    SkillRemovedSuccessfully: "skill removed successfully!\n".green,

    UserDoesNotHaveSKillError: "user does not have such skill!".red,

    WelcomeToAddBidMenu: "\nwelcome to  bid menu!\nyou can add a new bid using : "
        + "bid <username> <projectTitle> <bidAmount> <token>".green,

    BidAddedSuccessfully: "bid created successfully!\n".green,

    ProjectIsNotAvailableError: "cannot bid! project has already been taken.".red,

    NotSkilledEnoughError: "cannot bid! not skilled enough.".red,

    BidIsNotEnoughError: "cannot bid! bid amount not acceptable".red,

    BidIsValid: "your bid information is valid, your bid will now be created".green,

    WelcomeToAuctionMenu: "\nwelcome to  Auction menu!\nyou can hold an Auction for a project: "
        + "holdAuction <projectId> <token>".green,

    ProjectHasNoBid: "there are no bids on this project! cannot hold auction".red,

    CommandIsInvalidError: "command is invalid! try again".red,

}

module.exports = messages;