const Joi = require("joi");
const express = require("express");
const app = express();
app.use(express.json());




//PORT
const port = 3000;
app.listen(port, () => console.log("listening on port 3000" ));

//tabdil in array ha be khandane data as file

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
const courses = [
    {id: 1, name: "course1"},
    {id: 2, name: "course2"},
    {id: 3, name: "course3"}
]


//get
app.get("/api/courses", (req, res) => {
    res.send(projects);
});

app.get("/api/courses/:id", (req, res) => {
    const project = projects.find((c) => c.id === parseInt(req.params.id));
    if (!project) return res.status(404).send("The course with the given ID was not found!");
    else res.send(project);

});



//post
app.post("/api/courses", (req, res) => {
     const {error} = validateCourse(req.body);
     console.log("the error is "+error);
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

//put
app.put("/api/courses/:id", (req, res) => {
    //Look up the course
    //if not existing , return 404
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("The course with the given ID was not found!");


    //validate
    //if invalid return 400
    const {error} = validateCourse(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // update the course
    course.name = req.body.name;
    //return the updated course
    res.send(course);

});

//delete
app.delete("/api/courses/:id",(req,res) => {
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("The course with the given ID was not found!");

    const index = courses.indexOf(course);
    courses.splice(index,1);

    res.send(course);

});


//tools
function validateCourse(course) {

    const schema = Joi.object({
        name: Joi.string().required()
    });
    return schema.validate(course);


}



