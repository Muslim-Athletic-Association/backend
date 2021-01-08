const router = require('express').Router();
const m = require("../model/session");
const c = require("./routingConstants");

/**
 * get all sessions for a given program session. 
 */
router.get('/api/program/sessions', async function createMemberResponse(request, response) {
    // returns member information in json format if successful
    response.header('Access-Control-Allow-Origin', '*');
    await m.getSessions(request.body).then(async function (result) {
        return await c.simpleResponse(result, response);
    });
})

module.exports = router;