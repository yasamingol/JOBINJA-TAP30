const Joi = require("joi");
const express = require("express");
const fs = require('fs');
const app = express();
app.use(express.json());

//PORT
const port = 3000;
app.listen(port, () => console.log("listening on port 3000"));

/**************************************************Projects***********************************************************/
let projectData = fs.readFileSync('/home/tapsi/IdeaProjects/concurency/Server/Server-DataBase/projects-text', 'utf-8', 'r+');
let projects = projectData;


//get
app.get("/api/projects", (req, res) => {
    res.send(projects);
});

app.get("/api/projects/:id", (req, res) => {
    const project = JSON.parse(projects).find((c) => c.id === parseInt(req.params.id));
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