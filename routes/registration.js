const router = require("express").Router();
const r = require("../model/registration");
const p = require("../model/person");
const c = require("../model/constants");
const rc = require("./routingConstants");
const m = require("../model/mail");

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
router.post(
  "/api/registration/subscribe",
  async function createMemberResponse(request, response) {
    // returns member information in json format if successful
    await r.subscribe(request.body).then(async function (result) {
      return await rc.simpleResponse(result, response);
    });
  }
);

router.get(
  "/api/registration/getPrograms/:person",
  async function createMemberResponse(request, response) {
    // returns member information in json format if successful
    console.log(request.params);
    await r.getPrograms(request.params).then(async function (result) {
      return await rc.simpleResponse(result, response);
    });
  }
);

router.post(
  "/api/registration/temporary/subscribe",
  async function createMemberResponse(request, response) {
    // returns member information in json format if successful
    var subscribe_body = request.body;
    await p.createPerson(request.body).then(async function (result) {
        let getResult = await p.getPerson(request.body).then((result) => {
          return result;
        });
        if (result.ecode == c.errorEnum.NONE || result.ecode == c.errorEnum.UNIQUE) {
            await r
            .subscribe({ ...request.body, person_id: getResult.data[0].person_id })
            .then(async function (result2) {
                if (result2.success) {
                result2.error = "Successfully registered for this program.";
                }
                rc.simpleResponse(result2, response);
                m.registrationMail(subscribe_body);
            });
        } else {
            rc.simpleResponse(result, response);
        }
    });
  }
);

router.get(
  "/api/registration/check/:email",
  async function createMemberResponse(request, response) {
    // returns member information in json format if successful
    console.log("Checking to see if the following email is registered: ");
    console.log(request.params);
    await r.checkReg(request.params).then(async function (result) {
      console.log(result);
      return await rc.simpleResponse(result, response);
    });
  }
);

module.exports = router;
