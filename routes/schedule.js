const router = require("express").Router();
const c = require("../model/constants");
const rc = require("./routingConstants");
const fixtures = require("../model/fixture");
const schedule = require("../model/schedule");

router.post(
    "/api/upload/fixture",
    async function uploadFixture(request, response) {
        // Upload one fixture to the database.
        await fixtures
            .createFixture(request.body)
            .then(async function (result) {
                return await rc.simpleResponse(result, response);
            });
    }
);

router.get(
    "/api/upload/fixtures",
    async function uploadFixture(request, response) {
        // fetch fixtures from the database based on group (or group and date).
        await fixtures
            .getGroupFixtures(request.body)
            .then(async function (result) {
                return await rc.simpleResponse(result, response);
            });
    }
);

module.exports = router