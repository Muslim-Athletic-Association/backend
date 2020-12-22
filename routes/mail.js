// This file contains all of the routes that handle email related api requests.

const router = require('express').Router();
const m = require('../model/mail');

INTERNALERROR = { error: "Server Could not process the request" }
DUPLICATE = { error: "Duplicate" }

const errorEnum = {
    NONE: 0,
    UNIQUE: 1,
    UNKNOWN: 2,
    DNE: 3
}

EMPTY = {};

function setResult(d, pass, msg, code) {
    return { data: d, error: msg, success: pass, ecode: code };
}


router.post('/api/mail/yogaClassRegistration', async function (req, res) {
    //Return all teams information.
    res.header('Access-Control-Allow-Origin', '*');
    m.registrationMail(req.body, res).then(result => {return result});
})

router.post('/api/mail/contactus', async function (req, res) {
    //Return all teams information.
    res.header('Access-Control-Allow-Origin', '*');
    m.contactUs(req.body, res).then(result => {return result});
})

module.exports = router;