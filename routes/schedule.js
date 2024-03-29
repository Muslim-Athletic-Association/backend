const router = require("express").Router();
const c = require("../model/constants");
const rc = require("./routingConstants");
const fixtures = require("../model/fixture");

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

router.post(
    "/api/update/fixture/score",
    async function updateFixtureScore(request, response) {
        // Upload one fixture to the database.
        await fixtures.updateScore(request.body).then(async function (result) {
            return await rc.simpleResponse(result, response);
        });
    }
);

router.get(
    "/api/fixtures/:cgroup/:fixture_date?",
    async function fetchFixtures(request, response) {
        // fetch fixtures from the database based on group (or group and date).
        await fixtures
            .getGroupFixtures(request.params)
            .then(async function (result) {
                return await rc.simpleResponse(result, response);
            });
    }
);

module.exports = router;
