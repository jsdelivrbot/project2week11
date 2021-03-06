const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const url = require('url');
var bodyParser = require('body-parser')
const pg = require('pg-promise')({});
var conString = process.env.DATABASE_URL || "postgres://healthuser:Health@localhost:5432/project2";
const db = pg(conString);
const app = express();
var id;
app.use(bodyParser.urlencoded({
    extended: true
}));

// accept json 
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req,res)=> {
    res.render('pages/index', {title: "home"})
});
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
app.get('/getPulse', getPulse);
app.get('/getExercise', getExercise);
app.get('/getWeight', getWeight);
app.post('/signin', getUser);
app.get('/insert', insertData);
app.post('/createUser', createUser);

function getPulse(req, res) {
	//var url_parts = url.parse(req.url, true);
//    var id = parseInt(url_parts.query.id);
     //var test = id;
    console.log(id);
    // query database
    db.any('SELECT pulse FROM health WHERE person_id = $1', [id]) // returns promise
      .then((results)=> {
        console.log(results)
        res.status(200)
           .json(results)
      })
      .catch((err)=> {
          console.log(err)
          res.status(400)
             .json({"error":"Person does not exist."})
      })
}
function getExercise(req, res) {
	//var url_parts = url.parse(req.url, true);
    //var id = parseInt(url_parts.query.id);
    console.log(id);
    // query database
    db.any('SELECT exercise, exercise_time FROM health WHERE person_id = $1', [id]) // returns promise
      .then((results)=> {
        console.log(results)
        res.status(200)
           .json(results)
      })
      .catch((err)=> {
          console.log(err)
          res.status(400)
             .json({"error":"Person does not exist."})
      })
}
function getWeight(req, res) {
	//var url_parts = url.parse(req.url, true);
    //var id = parseInt(url_parts.query.id);
    console.log(id);
    // query database
    db.any('SELECT weight FROM health WHERE person_id = $1', [id]) // returns promise
      .then((results)=> {
        console.log(results)
        res.status(200)
           .json(results)
      })
      .catch((err)=> {
          console.log(err)
          res.status(400)
             .json({"error":"Person does not exist."})
      })
}

function getUser(req, res) {
    console.log("inside get user");
	var name = req.body.name;
	var pass = req.body.pass;
    console.log(name);
	console.log(pass);
    // query database
    db.one('SELECT name, id FROM person WHERE user_name = $1 AND password = $2', [name, pass]) // returns promise
      .then((results)=> {
        console.log(results)
        res.status(200)
           .json(results)
		   id = results.id;
		  console.log("getuser funct" + id);
      })
      .catch((err)=> {
          console.log(err)
          res.status(400)
             .json({"error":"Person does not exist."})
      })
}
function insertData(req, res) {
	
	var url_parts = url.parse(req.url, true);
	//var id = (url_parts.query.id);
    var exercise = (url_parts.query.exercise);
	var time = (url_parts.query.time);
	var weight = (url_parts.query.weight);
	var pulse = (url_parts.query.pulse);
	var date = (url_parts.query.date);
	//var id = 
    console.log("insert function" + id);
    // query database
	
    const query = db.one('INSERT INTO health (person_id, exercise, exercise_time, weight, pulse, day_of_input) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', 
	[id, exercise, time, weight, pulse, date]) // returns promise
      .then((query)=> {
        console.log("insert function" + query)
        res.status(200)
           .json(query)
		    //id = query.id;
		  //console.log("insert funct" + JSON.stringify(query));
      })
      .catch((err)=> {
          console.log(err)
          res.status(400)
             .json({"error":"could not insert data."})
      })
}
function createUser(req, res) {
	console.log(req.body.name1 + req.body.name);
	var name = req.body.name1;
	var pass = req.body.pass1;
	var username = req.body.username;
	console.log("createUser" + name + pass + username);
    // query database
    const query = db.one('INSERT INTO person (name, password, user_name) VALUES ($1, $2, $3) RETURNING id',
	[name, pass, username]) // returns promise
      .then((query)=> {
        res.status(200)
          .json(query)
		  id = query.id;
		  console.log("createuser funct" + JSON.stringify(query));
      })
      .catch((err)=> {
          console.log(err)
          res.status(400)
             .json({"error":"could not Create user account"})
      })
}

