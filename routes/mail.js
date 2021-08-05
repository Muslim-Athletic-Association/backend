// This file contains all of the routes that handle email related api requests.
const router = require('express').Router();
const m = require('../model/mail');
const c = require("../routes/routingConstants");

// TODO: handle registration confirmation mailing inside of registration model and remove their current endpoints, there's no point in sending a request for an email in this case.

router.post('/api/mail/registration', async function (req, res) {
    //Return all teams information.
    m.registrationMail(req.body, res).then(result => {return result});
})

router.post('/api/mail/contactus', async function (req, res) {
    //Return all teams information.
    m.contactUs(req.body, res).then(result => {return result});
})

module.exports = router;