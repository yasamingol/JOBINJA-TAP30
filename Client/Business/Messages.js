const messages = {

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
}

module.exports = messages;