const Joi = require("joi");
const express = require("express");
const fs = require('fs');
const app = express();
app.use(express.json());

//PORT
const port = 5000;
app.listen(port, () => console.log("listening on port 5000"));

/**************************************************Skills*************************************************************/
let skillData = fs.readFileSync('/home/tapsi/IdeaProjects/concurency/Server/Server-DataBase/skills-text', 'utf-8', 'r+');
let skills = skillData;

//get
app.get("/api/skills", (req, res) => {
    res.send(skills);
});

app.get("/api/skills/:id", (req, res) => {
    const skill = JSON.parse(skills).find((c) => c.id === parseInt(req.params.id));
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