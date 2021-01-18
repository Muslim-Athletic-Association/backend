const router = require('express').Router();
const p = require('../model/person');
const h = require("../model/constants");
const c = require("./routingConstants");
const toCSV = require('objects-to-csv');
const fs = require('fs');
const path = require('path');

/**
 * Add a person POST request handling.
 */
router.post('/api/addPerson', async function createMemberResponse(request, response) {
  response.header('Access-Control-Allow-Origin', '*');
  await p.createPerson(request.body).then(async function (result) {
    return await c.simpleResponse(result, response);
  });
});

router.post('/api/getPerson', async function createMemberResponse(request, response) {
  // returns member information in json format if successful
  response.header('Access-Control-Allow-Origin', '*');
  await p.getPerson(request.body).then(async function (result) {
    return await c.simpleResponse(result, response);
  });
})

// I randomly created this key to prevent anyone else from accessing the api without permission.
getMembersKey = "12w3sdfgahsjdkjad";

router.get('/api/getPeopleCSV', async function createMemberResponse(request, response) {
  // returns member information in json format if successful
  response.header('Access-Control-Allow-Origin', '*');
  await p.getPeople(request.body).then(async function (result) {
    var csv = new toCSV(result.data)
    if (!fs.existsSync('./assets/csv')) {
      fs.mkdirSync('./assets/csv');
    }
    await csv.toDisk('./assets/csv/person.csv');
    response.setHeader('Content-Type', 'text/csv');
    response.attachment(path.join(__dirname, '../assets/csv/person.csv'))
    response.sendFile(path.join(__dirname, '../assets/csv/person.csv'));
  });
})

module.exports = router;