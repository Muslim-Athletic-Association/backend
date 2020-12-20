const router = require('express').Router();
const program = require("../model/program");
const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs');
const db = require("../model/db.js");
const isFunction = require("../model/helper").isFunction;

var programs = {};
program.getPrograms().then((p)=>{programs = p});

router.get('/api/programs/getPrograms', (req, res) => {
    //Return all program information.
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200);
    res.json(programs);
})

router.post('/api/program/setPrice/:program/:price', (req, res) => {
    //Return all program information.
    res.header('Access-Control-Allow-Origin', '*');
    programs[req.params.program].setPrice(price);
    res.status(200);
    res.json(programs);
})

router.post('/api/validateRegistration/:program/:gender', (req, res) => {
    //Check to see if the individual can register for this program.
    res.header('Access-Control-Allow-Origin', '*');
    console.log(req.params.program, programs);
    //console.log(programs[req.params.program]);
    if (programs[req.params.program].validate(req.params.gender)){
        res.status(200);
        res.json({valid: true})
        return;
    }
    res.status(500);
    res.json(INTERNALERROR);
})

module.exports = router;