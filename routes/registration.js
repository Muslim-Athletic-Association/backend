const router = require('express').Router();
const p = require("../model/registration");
const c = require("./routingConstants");

/**
 * Add a program POST request handling.
 * 
 * request body requirements:
 *{
 *  person: "integer",
 *  subscription: "integer",
 *  datetime: "datetime",
 *  payment: "integer"
 *  consents:
 *      List(
 *      {
 *        person: "integer",
 *        datetime: "datetime",
 *        purpose: "integer",
 *        given: "bool"
 *      })
 *} 
 * 
 */
router.post('/api/registration/subscribe', async function createMemberResponse(request, response) {
    // returns member information in json format if successful
    response.header('Access-Control-Allow-Origin', '*');
    await p.subscribe(request.body).then(async function (result) {
        return await c.simpleResponse(result, response);
    });
})

router.get('/api/registration/getPrograms', async function createMemberResponse(request, response) {
    // returns member information in json format if successful
    response.header('Access-Control-Allow-Origin', '*');
    await p.getPrograms(request.body).then(async function (result) {
        return await c.simpleResponse(result, response);
    });
})

module.exports = router;