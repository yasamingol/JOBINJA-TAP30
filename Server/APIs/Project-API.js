const Joi = require("joi");
const express = require("express");
const fs = require('fs');
const app = express();
app.use(express.json());

//PORT
const port = 3000;
app.listen(port, () => console.log("listening on port 3000"));

/**************************************************Projects*****************************************************************/
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
    let arr = JSON.parse(projects);
    const project = {
        id: arr.length + 1,
        title: req.body.title,
        skills: req.body.skills,
        budget: req.body.budget,
        listOfBids: req.body.listOfBids,
        deadline: req.body.deadline,
        isAvailable: req.body.isAvailable
    };
    arr.push(project);
    fs.writeFileSync("/home/tapsi/IdeaProjects/concurency/Server/Server-DataBase/projects-text",JSON.stringify(arr),'utf-8', 'r+');
    res.send("project built");
});

//delete
app.delete("/api/projects/:id", (req, res) => {
    const project = projects.find((c) => c.id === parseInt(req.params.id));
    if (!project) return res.status(404).send("The course with the given ID was not found!");

    const index = projects.indexOf(project);
    projects.splice(index, 1);

    res.send(project);

});

