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

/**
 * Remove a program POST request handling.
 */
router.post('/api/deleteProgram', async function createMemberResponse(request, response) {
    // returns member information in json format if successful
    response.header('Access-Control-Allow-Origin', '*');
    await p.deleteProgram(request.body).then(async function (result) {
        return await c.simpleResponse(result, response);
    });
})

/**
 * Remove a program POST request handling.
 * 
 */
router.get('/api/getPrograms', async function createMemberResponse(request, response) {
    // returns member information in json format if successful
    response.header('Access-Control-Allow-Origin', '*');
    await p.getPrograms(request.body).then(async function (result) {
        return await c.simpleResponse(result, response);
    });
})

module.exports = router;