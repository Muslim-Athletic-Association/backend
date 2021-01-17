const router = require('express').Router();
const r = require("../model/registration");
const p = require("../model/person");
const c = require("../model/constants");
const mail = require("../model/mail");
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
    await p.createPersonTemp(request.body).then(async function (result) {
        if (!result.success) {
            if (result.ecode == c.errorEnum.UNIQUE) {
                console.log("person already exists, registering them for program.")
                result = await p.getPersonTemp(request.body).then((result) => { return result });
            } else {
                console.log("Should have returned a response")
                return await rc.simpleResponse(result, response);
            }
        }
        console.log(result.success);
        await r.subscribe({ ...request.body, person: result.data[0].person_id }).then(async function (result2) {
            console.log("subscribing person")
            if (result2.success) {
                result2.error = "Successfully registered for this program."
		mail.yogaMail(subscribe_body);
            }
            return await rc.simpleResponse(result2, response);
        });
    });
});

module.exports = router;
