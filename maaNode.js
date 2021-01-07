// This is the node file, this is where are all of the http requests are handled
// and where the database is accessed
var port = 3001;

const http = require('http');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const person = require('./routes/person');
const program = require('./routes/program');
const registration = require('./routes/registration');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(person);
app.use(program);
app.use(registration);


// This sets the options for https so that it finds the ssl certificates
//var privateKey = fs.readFileSync('/etc/letsencrypt/live/muslimathleticassociation.org-0001/privkey.pem');
//var certificate = fs.readFileSync('/etc/letsencrypt/live/muslimathleticassociation.org-0001/cert.pem');
//const httpsOptions = {
//  cert: certificate,
//  key: privateKey
//}

//var httpsServer = https.createServer(httpsOptions, app).listen(port, () => {
//  console.log("Serving on https");
//});

app.listen(port, () => {console.log("Listening on port " + port)})
