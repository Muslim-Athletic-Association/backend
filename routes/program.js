const router = require('express').Router();
const p = require("../model/program");
const c = require("./routingConstants");

/**
 * Add a program POST request handling.
 * See createProgram function for request body requirements.
 */
router.post('/api/addProgram', async function createMemberResponse(request, response) {
    // returns member information in json format if successful
    await p.createProgram(request.body).then(async function (result) {
        return await c.simpleResponse(result, response);
    });
})

/**
 * Remove a program POST request handling.
 */
router.post('/api/deleteProgram', async function createMemberResponse(request, response) {
    // returns member information in json format if successful
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
    await p.getPrograms(request.body).then(async function (result) {
        return await c.simpleResponse(result, response);
    });
})

module.exports = router;