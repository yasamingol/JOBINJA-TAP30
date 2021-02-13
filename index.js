const Joi = require("joi");
const express = require("express");
const app = express();
app.use(express.json());


//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("listening on port " + port));


const courses = [
    {id: 1, name: "course1"},
    {id: 2, name: "course2"},
    {id: 3, name: "course3"}
]

//get
app.get("/", (req, res) => {
    res.send("hello world!");
});
app.get("/api/courses", (req, res) => {
    res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("The course with the given ID was not found!");
    else res.send(course);

});

//post
app.post("api/courses", (req, res) => {
    const {error} = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1, name: req.body.name
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
    const schema = {
        name: Joi.string().required()
    };
    return Joi.valid(course,schema);

}

