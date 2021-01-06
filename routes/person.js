const router = require('express').Router();
const p = require('../model/person');
const h = require("../model/constants");
const c = require("./routingConstants");

/**
 * Add a person POST request handling.
 */
router.post('/api/addPerson', async function createMemberResponse(request, response) {
  response.header('Access-Control-Allow-Origin', '*');
  await p.createPerson(request.body).then(async function (result) {
    return await c.simpleResponse(result, response);
  });
});

module.exports = router;