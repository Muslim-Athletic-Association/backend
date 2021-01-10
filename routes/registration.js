const router = require('express').Router();
const r = require("../model/registration");
const p = require("../model/person");
const c = require("../model/constants");
const rc = require("./routingConstants");

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
    await r.subscribe(request.body).then(async function (result) {
        return await rc.simpleResponse(result, response);
    });
})

router.get('/api/registration/getPrograms/:person', async function createMemberResponse(request, response) {
    // returns member information in json format if successful
    response.header('Access-Control-Allow-Origin', '*');
    console.log(request.params)
    await r.getPrograms(request.params).then(async function (result) {
        return await rc.simpleResponse(result, response);
    });
})

router.post('/api/registration/temporary/subscribe', async function createMemberResponse(request, response) {
    // returns member information in json format if successful
    response.header('Access-Control-Allow-Origin', '*');
    var subscribe_body = request.body;
    await p.createPerson(request.body).then(async function (result) {
	if (result.ecode == c.errorEnum.UNIQUE) {
            result = await p.getPerson(request.body).then((result) => { return result });
        } else if (!result.success){
	    return await rc.simpleResponse(result, response);
	}
        await r.subscribe({ ...request.body, person: result.data[0].person_id }).then(async function (result2) {
            if(result2.success){
                result2.error = "Successfully registered for this program."
            }
            return await rc.simpleResponse(result2, response);
        });
    });
})

module.exports = router;
