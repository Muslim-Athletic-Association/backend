// This is the node file, this is where are all of the http requests are handled
// and where the database is accessed
var port = 3001;

const http = require('http');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
// const checkout = require('./routes/checkout');
const member = require('./routes/member');
const program = require('./routes/program');
// const soccer = require('./routes/soccer');
// const yoga = require('./routes/yoga');
// const mail = require('./routes/mail');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // This line was added to support the square payments?
// app.use(checkout);
// app.use(member);
app.use(program);
// app.use(soccer);
// app.use(yoga);
// app.use(mail);


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
