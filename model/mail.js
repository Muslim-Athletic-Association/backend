
var nodemailer = require('nodemailer');
var fs = require('fs');
var path = require('path');
const { program } = require('./program');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'automaareply@gmail.com',
        pass: 'passtheword123'
    }
});

async function registrationMail(data, res) {
    // Send a preset confirmation email to the individual who signed up based on the program
    // required attributes of the body: {email, program}

    var p = String(data.program).toUpperCase()
    switch(p){
        case "YOGA":
            var registrationConfirmation = fs.readFileSync(path.join(__dirname, "../assets/email/yoga.html"),"utf-8");
    }

    var mailOptions = {
        from: 'autmaareply@gmail.com',
        to: data.email,
        subject: 'MAA ' + p + ' REGISTRATION CONFIRMATION',
        html: template
    };
    return await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.json(403);
        } else {
            console.log('Email sent: ' + info.response);
            res.json(200);
        }
    });
}

async function contactUs(data, res) {
    // Send a contact us email to from the website
    // required attributes of the body: {email, subject, name, message}

    var mailOptions = {
        from: 'autmaareply@gmail.com',
        to: data.email,
        subject: 'MAA contact us form: ' + data.subject,
        bcc: "info@maaweb.org",
        text: "This is a copy of the message sent through the MAA contact form from " + data.name + ":\n\n" + data.message,
    };
    return await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.json(403);
        } else {
            console.log('Email sent: ' + info.response);
            res.json(200);
        }
    });
}

module.exports = {
    contactUs: contactUs,
    registrationMail: registrationMail
}