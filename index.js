//returns a class
const Joi = require('joi');
//returns a function
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
  {id:1, name:'course 1'},
  {id:2, name:'course 2'},
  {id:3, name:'course 3'},
];
// first arg(paht ) = url '/'root of addreess
app.get('/',(req,res) => {
  res.send('Coding too');
});

app.get('/api/courses',(req,res)=>{
  res.send(courses );
});

//identifier can be accesed through req
app.get('/api/courses/:id', (req,res)=>{
  const course =  courses.find(c=> c.id === parseInt(req.params.id));
  if(!course) return res.status(404).send('id not found');
  res.send(course);
});

app.post('/api/courses', (req,res) => {

  const {error} = validateCourse(req.body);
  if(error) return res.status(400).send(error.details [0].message);

  const course = {
    id : courses.length + 1,
    name : req.body.name,
  }
  courses.push(course);
  res.send(course);
});

app.put('/api/courses/:id', (req,res)=>{
  // look up course
  // not found - 404
  const course =  courses.find(c=> c.id === parseInt(req.params.id));
  if (!course)return res.status(404).send('course not found');

  const {error} = validateCourse(req.body);
  if(error)return res.status(400).send(error.details [0].message);


  // update course
  course.name = req.body.name;
  //return updated course to client
  res.send(course);
});

//Validate
//If invalide, return 400 - bad request
function validateCourse(course){
  const schema = {
    name: Joi.string() .min(3).required()
  };
  return Joi.validate(course, schema);
}

app.delete('/api/courses/:id',(req,res)=>{
  const course =  courses.find(c=> c.id === parseInt(req.params.id));
  if (!course)return res.status(404).send('course not found');

  const index =  courses.indexOf(course);
  courses.splice(index,1);

  res.send(course);
});

// address dynamically assigned
const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`listening on port ${port}...`)});
