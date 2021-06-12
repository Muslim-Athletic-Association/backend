const router = require("express").Router();
const r = require("../model/registration");
const p = require("../model/person");
const t = require("../model/team");
const c = require("../model/constants");
const rc = require("./routingConstants");
const m = require("../model/mail");

// https://firebase.google.com/docs/auth/admin

/**
 * Prerequisites to completing the below functionality:
 * We must create a competition first
 */

/**
 * Register a captain for a team based competition
 * Steps:
 * 1. Create a person (person model) <- This should actually happen through firebase.
 * 2. Register the person to a subscription (registration model)
 * 3. Create a team (TODO: team model)
 *
 * Note: Attaching each team to it's competitionGroup (aka division) using TeamRecord
 * will only happen after the number of divisions have been decided and the division
 * in which each team should be placed is decided. We can come up with an algorithm to
 * decide which division to place teams, but that seems unreliable. We may stick to doing
 * it manually in which case, it would be good to have an api endpoint that would switch up
 * the competitionGroup of each team.
 */

router.post(
    "/api/competition/create/team",
    async function compSubResp(request, response) {
        // Register a person as captain for the league and create their team.
        response.header("Access-Control-Allow-Origin", "*");
        await r.subscribe(request.body).then(async function (result) {
            return await t.createTeam(request.body).then(() => {
                return await rc.simpleResponse(result, response);
            });
        });
    }
);

router.get(
    "/api/competition/:program/:competition/getTeams",
    async function createMemberResponse(request, response) {
        // returns member information in json format if successful
        response.header("Access-Control-Allow-Origin", "*");
        await r.getPrograms(request.params).then(async function (result) {
            return await rc.simpleResponse(result, response);
        });
    }
);

/**
 * Register a person for a team based competition
 * Steps:
 * 1. Create a person (person model)
 * 2. Register the person to a subscription (subscription model)
 * 3. Create a player based on person and team (TODO: team model)
 */

 router.post(
    "/api/competition/register/:person",
    async function createMemberResponse(request, response) {
        // returns member information in json format if successful
        response.header("Access-Control-Allow-Origin", "*");
        console.log(request.params);
        await r.getPrograms(request.params).then(async function (result) {
            return await rc.simpleResponse(result, response);
        });
    }
);