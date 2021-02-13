const Joi = require("joi");
const express = require("express");
const app = express();
app.use(express.json());

//PORT
const port = 3000;
app.listen(port, () => console.log("listening on port 3000" ));

/**************************************************Projects***********************************************************/
const projects = [
    {
        id: 1,
        title: "tap30",
        skills: [
            {"name": "Java", "point": 5},
            {"name": "CSS", "point": 10},
            {"name": "JS", "point": 20}
        ],
        budget:4000,
        listOfBids:[],
        deadline:"2022/03/02",
        isAvailable:true
    }

]

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
     const {error} = validateProject(req.body);
     console.log("the error is "+error);
    if (error) return res.status(400).send(error.details[0].message);

    const project = {
        id: projects.length+1,
        title: "snap",
        skills: [
            {"name": "C", "point": 5},
            {"name": "REACT", "point": 8},
            {"name": "HTML", "point": 2}
        ],
        budget:456,
        listOfBids:[],
        deadline:"2030/07/12",
        isAvailable:true
    };
    projects.push(project);
    res.send(project);
});

//delete
app.delete("/api/projects/:id",(req,res) => {
    const project = projects.find((c) => c.id === parseInt(req.params.id));
    if (!project) return res.status(404).send("The course with the given ID was not found!");

    const index = projects.indexOf(project);
    projects.splice(index,1);

    res.send(project);

});

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


//tools
function validateProject(project) {

    const schema = Joi.object({
        title: Joi.string().required(),
        skills: Joi.required(),
        budget: Joi.number().required(),
        deadline: Joi.required(),
        isAvailable: Joi.boolean().required()
    });
    return schema.validateAsync(project);


}

/**************************************************Skills*************************************************************/

/**************************************************Accounts***********************************************************/




