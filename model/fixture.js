const { get } = require("../routes/team");
const { setResult } = require("./constants");
const c = require("./constants");
const isFunction = c.isFunction;
const errorEnum = c.errorEnum;
const tm = require("./team");

/**
 * Create a fixture and player records based on the given data.
 * Initial implementation will likely exclude player records.
 *
 * @param {name: string} data
 */
async function createFixture(data) {
    var invalid = c.simpleValidation(data, {
        team1: "int",
        team2: "int",
        cgroup: "int",
        date: "int",
        time: "int",
    });
    if (invalid) {
        return invalid;
    }
    var sql =
        "INSERT INTO fixture (team1, team2, cgroup, fixture_date, fixture_time) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
    var params = [data.team1, data.team2, data.cgroup, data.fixture_date, data.fixture_time];
    var m = new c.Message({
        success: "Successfully created fixture.",
    });
    return await c.create(sql, params, m).then((result) => {
        /* Add player records to all players registered for teams in this fixture */
        return result;
    });
}

/**
 * Update a fixture based on the given data
 * Team records should also be updated. This function will calculate who won,
 * lost or tied based on the score.
 *
 * @param {name: string} data
 */
async function updateScore(data) {
    var invalid = c.simpleValidation(data, {
        team1: "int",
        team2: "int",
        score1: "int",
        score2: "int",
        cgroup: "int",
        fixture_date: "int",
        fixture_time: "int",
    });
    if (invalid) {
        return invalid;
    }
    var sql =
        "UPDATE fixture SET score1=$6, score2=$7 WHERE team1=$1 AND team2=$2 AND cgroup=$3 AND fixture_date=$4 AND fixture_time=$5 RETURNING *;";
    var params = [data.team1, data.team2, data.cgroup, data.fixture_date, data.fixture_time, data.score1, data.score2];
    var m = new c.Message({
        success: "Successfully updated fixture.",
    });
    return await c.update(sql, params, m).then((result) => {
        /* Add player records to all players registered for teams in this fixture */
        return result;
    });
}

/**
 * Get fixtures based on cgroup
 *
 * @param {name: string} data
 */
async function getGroupFixtures(data) {
    var invalid = c.simpleValidation(data, {
        cgroup: "int",
    });
    if (invalid) {
        return invalid;
    }

    var containsDate = c.simpleValidation(
        data,
        {
            fixture_date: "date",
        },
        false
    );
    if (containsDate) {
        var sql = "SELECT * FROM fixture WHERE cGroup=$1;";
        var params = [data.cgroup];
        var m = new c.Message({
            success: "Successfully fetched fixtures.",
        });
    } else {
        console.log("Date passed in, fetching fixtures by date");
        var sql = "SELECT * FROM fixture WHERE cGroup=$1 and fixture_date=$2;";
        var params = [data.cgroup, data.fixture_date];
        var m = new c.Message({
            success: "Successfully fetched fixtures by date.",
        });
    }
    return await c.retrieve(sql, params, m);
}

module.exports = {
    createFixture: createFixture,
    updateScore: updateScore,
    getGroupFixtures: getGroupFixtures,
};
