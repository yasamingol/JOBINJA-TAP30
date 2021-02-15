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
    let arr = JSON.parse(skills);
    const skill = {
        id: arr.length + 1,
        name: req.body.name,
    };
    arr.push(skill);
    fs.writeFileSync("/home/tapsi/IdeaProjects/concurency/Server/Server-DataBase/skills-text",JSON.stringify(arr),'utf-8', 'r+');
    res.send("skill built");

});

//delete

app.delete("/api/skills/:id", (req, res) => {
    const skill = skills.find((c) => c.id === parseInt(req.params.id));
    if (!skill) return res.status(404).send("The course with the given ID was not found!");

    const index = skills.indexOf(skill);
    skills.splice(index, 1);
    res.send(skill);

});