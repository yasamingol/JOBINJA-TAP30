const Joi = require("joi");
const express = require("express");
const fs = require('fs');
const temp = require("assert");
const app = express();
app.use(express.json());

//PORT
const port = 4000;
app.listen(port, () => console.log("listening on port 4000"));
/**************************************************Accounts***********************************************************/
let accountData = fs.readFileSync('/home/tapsi/IdeaProjects/concurency/Server/Server-DataBase/accounts-text', 'utf-8', 'r+');
let accounts = accountData;

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

    let arr = JSON.parse(accounts);
    const account = {
        id: arr.length + 1,
        username: req.body.username,
        skills: req.body.skills ,
        asignedProjectList: req.body.asignedProjectList,
        skillConfirmationList: req.body.skillConfirmationList
    };

    arr.push(account);
    fs.writeFileSync("/home/tapsi/IdeaProjects/concurency/Server/Server-DataBase/accounts-text",JSON.stringify(arr),'utf-8', 'r+');
    res.send("account built");
});

//delete
app.delete("/api/projects/:id", (req, res) => {
    const account = accounts.find((c) => c.id === parseInt(req.params.id));
    if (!account) return res.status(404).send("The course with the given ID was not found!");

    const index = accounts.indexOf(account);
    accounts.splice(index, 1);

    res.send(account);
});


