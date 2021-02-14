const Joi = require("joi");
const express = require("express");
const fs = require('fs');
const app = express();
app.use(express.json());

//PORT
const port = 4000;
app.listen(port, () => console.log("listening on port 4000"));
/**************************************************Accounts***********************************************************/
let accountData = fs.readFileSync('/home/tapsi/IdeaProjects/concurency/Server/Server-DataBase/accounts-text', 'utf-8', 'r+');
const accounts = accountData;

//get
app.get("/api/accounts", (req, res) => {
    res.send(accounts);
});

app.get("/api/accounts/:id", (req, res) => {
    const account = JSON.parse(accounts).find((c) => c.id === parseInt(req.params.id));
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
        skills: req.body.skills ,
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


