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

router.post(
    "/api/createSchedule",
    async function createFixtures(request, response) {
        // Create a schedule based on a list of team names.
        // Step 1: Sanitize the list of team names
        // Step 2: Ensure that no schedule already exists for this group
        //  i.e. cannot generate a new schedule for a group that already contains a fixture.


        // Step 3: Create schedule using generate_matches() in schedule model
        //  ^To be tested first.
        await schedule
            .generateMatches(request.body)
            .then(async function (result) {
                return await rc.simpleResponse(result, response);
            });
    }
);

module.exports = router;
