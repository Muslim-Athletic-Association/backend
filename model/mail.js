const router = require('express').Router();
var nodemailer = require('nodemailer');
var fs = require('fs');
var path = require('path');

const registrationConfirmation = fs.readFileSync(path.join(__dirname, "../assets/email/registrationConfirmation.html"),"utf-8");

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'automaareply@gmail.com',
        pass: 'passtheword123'
    }
});

/**
 * This is only temporary, I would prefer to customize the emails.
 * Registration body required attributes: {email}
*/

router.post('/api/mail/yogaClassRegistration', async function (req, res) {
    //Return all teams information.
    res.header('Access-Control-Allow-Origin', '*');
    registrationMail(req.body, res).then(result => {return result});
})

async function registrationMail(data, res) {
    var mailOptions = {
        from: 'autmaareply@gmail.com',
        to: data.email,
        subject: 'MAA YOGA CLASS REGISTRATION CONFIRMATION',
        html: registrationConfirmation
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

module.exports = router;