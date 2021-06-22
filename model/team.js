const { setResult } = require("./constants");
const c = require("./constants");
const isFunction = c.isFunction;
const errorEnum = c.errorEnum;

/**
 * Uses the Create operation from ./constants in order to add a player to a team.
 *
 * @param {name: string} data
 */
async function addPlayer(data, message = "") {
    var invalid = c.simpleValidation(data, {
        team: "string",
        person: "int",
    });
    if (invalid) {
        return invalid;
    }
    var sql = "INSERT INTO player (team, person) VALUES ($1, $2) RETURNING *;";
    var params = [data.team, data.person];
    var m = new c.Message({
        success: message + "Successfully created player.",
        duplicate: "This player is already registered for this team.",
        foreign: "It seems that this team doesn't exist.",
    });
    return await c.create(sql, params, m);
}

/**
 * Uses the Create operation from ./constants in order to insert a team into the database.
 *
 * TODO: Clean this function up
 *
 * @param {name: string} data
 */
async function createTeam(data) {
    var invalid = c.simpleValidation(data, {
        team_name: "string",
        person: "int", // person, captain
        team_capacity: "int",
    });
    if (invalid) {
        return invalid;
    }
    var sql =
        "INSERT INTO team (team_name, captain, team_capacity) VALUES ($1, $2, $3) RETURNING *;";
    var params = [data.team_name, data.person, data.team_capacity];
    var m = new c.Message({
        success: "Successfully created team. ",
        duplicate:
            "A team with that name already exists, choose another team name.",
        foreign: "Captain must log in first in order to create a team.",
    });
    return await c
        .create(sql, params, m)
        .then(async (result) => {
            if (result.success) {
                let playerData = {
                    person: data.person,
                    team: data.team_name,
                };
                let player = await addPlayer(playerData, m.success);
                if (player.success) {
                    return result;
                } else {
                    return player;
                }
            }
            return result;
        })
        .then(async (result2) => {
            if (result2.success) {
                var sql =
                    "INSERT INTO teamRecord (team, group_id) VALUES ($1, $2) RETURNING *;";
                // Group is currently hard coded
                var params = [result2.data[0].team_id, 1];
                await c.create(sql, params, m);
            }
            return result2;
        });
}

/**
 * Uses the remove operation from ./constants in order to remove a team from the database.
 *
 * @param {name: string} data
 */
async function deleteTeam(data) {
    var invalid = c.simpleValidation(data, {
        team_name: "string",
    });
    if (invalid) {
        return invalid;
    }
    var sql = "DELETE FROM team WHERE team_name=$1 RETURNING *;";
    var params = [data.team_name];
    var m = new c.Message({
        success: "Successfully removed team.",
    });
    return await c.remove(sql, params, m);
}

/**
 * Fetches all of the teams registered for a league based on the league's title.
 *
 * Please note: at the beginning of a season, teams may all be
 * placed into the same initial group.
 *
 * @param {name: string} data
 */
async function getTeamsByCompetition(data) {
    var invalid = c.simpleValidation(data, {
        compTitle: "int",
    });
    if (invalid) {
        return invalid;
    }

    // TODO: Must create necessary views first (see the three new tables in ../db/views.ddl)
    var sql = "select * from teamCompetition where title=$1;";
    var params = [data.compTitle];
    var m = new c.Message({
        success: "Successfully retrieved all teams.",
    });
    return await c.retrieve(sql, params, m);
}

/**
 * Fetches all of the teams in a division within a league.
 *
 * @param {name: string} data
 */
async function getTeamsByDivision(data) {
    var invalid = c.simpleValidation(data, {
        competition: "int",
        group_id: "int",
    });
    if (invalid) {
        return invalid;
    }
    var sql =
        "SELECT * from team join teamRecord tr where tr.competition=$1 and tr.group_id=$2;";
    var params = [data.competition, data.group_id];
    var m = new c.Message({
        success: "Successfully retrieved all teams.",
    });
    return await c.retrieve(sql, params, m);
}

// I need to find all teams based on a competition, which should have a many to many relationship
// This is because each team can play in multiple competitions and each competition can have multiple teams.

// In order to do this, I need to select all of the teams that have a record in a specfic group.
// My issue is that I have a many to many relationship that seems to go through two tables:
// competition group and team record.

// What if teamRecord kept track of the division (competition group)? Instead of creating a whole new table.
// Then for individual competitions we could also put individual levels in the "competitor record" as well.

module.exports = {
    createTeam: createTeam,
    deleteTeam: deleteTeam,
    addPlayer: addPlayer,
    getTeamsByCompetition: getTeamsByCompetition
};
