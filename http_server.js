const express = require('express');
const app     = express();
const low     = require('lowdb');
const fs      = require('lowdb/adapters/FileSync');
const adapter = new fs('db.json');
const db      = low(adapter);
const { faker } = require('@faker-js/faker');
const cors    = require('cors');

// ------ SERVER INITIALIZATION ------
// allow serving of static files
app.use(express.static('public'));

// data parser - used to parse post-data from CURL request
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ------ DATA INITIALIZATION ------
// init the data store
db.defaults({ users: []}).write();


// ------ ROUTING ------

// return all users at "data" route
app.get('/data', function(req, res) {
    res.send(db.get('users').value());
});

app.post('/add', (req, res) => {
    var user = {
        'name'          : req.body.name,
        'dob'           : req.body.dob,
        'email'         : req.body.email,
        'username'      : req.body.username,
        'password'      : req.body.password,
        'phone'         : req.body.phone,
        'streetaddress' : req.body.streetaddress,
        'citystatezip'  : req.body.citystatezip,
        'latitude'      : req.body.latitude,
        'longitude'     : req.body.longitude,
        'avatar'        : faker.internet.avatar() 
    };
    db.get('users').push(user).write();
    console.log(db.get('users').value());
    res.send(db.get('users').value());
});

// curl -H "Content-Type: application/json" -X POST -d '{"username":"peterparker","password":"secret"}' http://localhost:3000/test
app.post('/test', (req, res) => {
    // this is being run on the server, not the client
    console.log(req.body.username, req.body.password);

    // the response is sent back to the client. Without a response, the terminal or CURL will hang
    res.send(req.body.username + " " + req.body.password)
});

// ------ INITIALIZE SERVER ------

// start server
app.listen(3000, function() {
    console.log('Running on post 3000!')
});

