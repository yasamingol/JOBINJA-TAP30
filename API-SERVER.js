const Joi = require("joi");
const express = require("express");
const app = express();
app.use(express.json());


//PORT
const port = 3000;
app.listen(port, () => console.log("listening on port 3000"));

/**************************************************Projects***********************************************************/
//allProjetcs load from Server-DataBase
const fs = require('fs');
const projectsData = fs.readFileSync('/home/tapsi/IdeaProjects/concurency/Server-DataBase/projects-text',
    {encoding:'utf8', flag:'r'});
const projects = projectsData;

//get
app.get("/api/projects", (req, res) => {
    res.send(projects);
});

app.get("/api/projects/:id", (req, res) => {
    const project = projects.find((c) => c.id === parseInt(req.params.id));
    if (!project) return res.status(404).send("The course with the given ID was not found!");
    else res.send(project);
});


//post
app.post("/api/projects", (req, res) => {
    /*
    //validating required data
     const {error} = validateProject(req.body);
    console.log("the error is " + error);
    if (error) return res.status(400).send(error.details[0].message);
     */

    const project = {
        id: projects.length + 1,
        title: req.body.title,
        skills: req.body.skills,
        budget: req.body.budget,
        listOfBids: req.body.listOfBids,
        deadline: req.body.deadline,
        isAvailable: req.body.isAvailable
    };
    projects.push(project);
    res.send(project);
});

//delete
app.delete("/api/projects/:id", (req, res) => {
    const project = projects.find((c) => c.id === parseInt(req.params.id));
    if (!project) return res.status(404).send("The course with the given ID was not found!");

    const index = projects.indexOf(project);
    projects.splice(index, 1);

    res.send(project);

});


/*
//put
app.put("/api/projects/:id", (req, res) => {

    const project = projects.find((c) => c.id === parseInt(req.params.id));
    if (!project) return res.status(404).send("The course with the given ID was not found!");


    //validate
    //if invalid return 400
    const {error} = validateProject(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    // update the course
    project.title = req.body.title;
    //return the updated course
    res.send(project);

});

 */

/**************************************************Skills*************************************************************/
//allSkills load from Server-DataBase
const skillsData = fs.readFileSync('/home/tapsi/IdeaProjects/concurency/Server-DataBase/skills-text',
    {encoding:'utf8', flag:'r'});
const skills = skillsData;

//get
app.get("/api/skills", (req, res) => {
    res.send(skills);
});

app.get("/api/skills/:id", (req, res) => {
    const skill = skills.find((c) => c.id === parseInt(req.params.id));
    if (!skill) return res.status(404).send("The skill with the given ID was not found!");
    else res.send(skill);
});
//post
app.post("/api/skills", (req, res) => {
    /*
    //validating required data
     const {error} = validateSkill(req.body);
    console.log("the error is " + error);
    if (error) return res.status(400).send(error.details[0].message);
     */

    const skill = {
        id: projects.length + 1,
        name: req.body.name,
    };
    skills.push(skill);
    res.send(skill);

});

//delete

app.delete("/api/skills/:id", (req, res) => {
    const skill = skills.find((c) => c.id === parseInt(req.params.id));
    if (!skill) return res.status(404).send("The course with the given ID was not found!");

    const index = skills.indexOf(skill);
    skills.splice(index, 1);
    res.send(skill);

});
/**************************************************Accounts***********************************************************/
////allAccounts load from Server-DataBase
const accountsData = fs.readFileSync('/home/tapsi/IdeaProjects/concurency/Server-DataBase/accounts-text',
    {encoding:'utf8', flag:'r'});
const accounts = accountsData;

//get
app.get("/api/accounts", (req, res) => {
    res.send(accounts);
});

app.get("/api/accounts/:id", (req, res) => {
    const account = accounts.find((c) => c.id === parseInt(req.params.id));
    if (!account) return res.status(404).send("The course with the given ID was not found!");
    else res.send(account);
});


//post
app.post("/api/accounts", (req, res) => {
    /*
    //validating required data
     const {error} = validateAccount(req.body);
    console.log("the error is " + error);
    if (error) return res.status(400).send(error.details[0].message);
     */

    const account = {
        id: projects.length + 1,
        username: req.body.username,
        skills: req.body.skills,
        asignedProjectList: [],
        skillConfirmationList: []
    };
    accounts.push(account);
    res.send(account);
});

//delete
app.delete("/api/projects/:id", (req, res) => {
    const account = accounts.find((c) => c.id === parseInt(req.params.id));
    if (!account) return res.status(404).send("The course with the given ID was not found!");

    const index = accounts.indexOf(account);
    accounts.splice(index, 1);

    res.send(account);
});


/***********************************************validation-functions**************************************************/
function validateProject(project) {

    const schema = Joi.object({
        title: Joi.string().required(),
        skills: Joi.required(),
        budget: Joi.number().required(),
        listOfBids: Joi.required(),
        deadline: Joi.required(),
        isAvailable: Joi.boolean().required()
    });
    return schema.validateAsync(project);


}

function validateSkill(project) {
}

function validateAccount(project) {
}

/***********************************************Tool-functions********************************************************/







