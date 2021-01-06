// This file contains all of the routes that handle email related api requests.

const router = require('express').Router();
const m = require('../model/mail');
const h = require("../model/constants");
const isFunction = h.isFunction;
const errorEnum = h.errorEnum; 
const setResult = h.setResult;

INTERNALERROR = { error: "Server Could not process the request" }
DUPLICATE = { error: "Duplicate" }

EMPTY = {};


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