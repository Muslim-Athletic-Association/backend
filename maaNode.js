const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const person = require('./routes/person');
const program = require('./routes/program');
const registration = require('./routes/registration');
const sessions = require('./routes/session');
const auth = require('./routes/auth');
const team = require('./routes/team');
const schedule = require('./routes/schedule');
const mail = require('./routes/mail');
const cookieParser = require("cookie-parser");

var port = 3001;

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    credentials: true,
    origin: "http://offlinequran.com"
  }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`\nEndpoint Hit: ${req.originalUrl}\n`)
  next()
})

app.use(auth.router);
app.use(person);
app.use(program);
app.use(registration);
app.use(team);
app.use(schedule);
app.use(sessions);
app.use(mail);

// This sets the options for https so that it finds the ssl certificates
//  var privateKey = fs.readFileSync('/etc/letsencrypt/live/muslimathleticassociation.org-0001/privkey.pem');
//  var certificate = fs.readFileSync('/etc/letsencrypt/live/muslimathleticassociation.org-0001/cert.pem');
//  const httpsOptions = {
//    cert: certificate,
//    key: privateKey
//  }

//  var httpsServer = https.createServer(httpsOptions, app).listen(port, () => {
//    console.log("Serving on https");
//  });

app.listen(port, () => {console.log("Listening on port " + port)})
