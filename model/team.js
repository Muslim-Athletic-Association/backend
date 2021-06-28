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
        person_id: "int", // person, captain
        team_capacity: "int",
    });
    if (invalid) {
        return invalid;
    }
    var sql =
        "INSERT INTO team (team_name, captain, team_capacity) VALUES ($1, $2, $3) RETURNING *;";
    var params = [data.team_name, data.person_id, data.team_capacity];
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
                    person: data.person_id,
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

/**
 * Create a team record based on the given data
 * 
 * @param {name: string} data
 */
async function createTeamRecord(data){
    var invalid = c.simpleValidation(data, {
        team_id: "int",
        group_id: "int",
    });
    if (invalid) {
        return invalid;
    }
    var sql =
        "INSERT INTO teamRecord (team, group_id) VALUES ($1, $2) RETURNING *;";
    var params = [data.team_id, data.group_id];
    var m = new c.Message({
        success: "Successfully created team record.",
    });
    return await c.create(sql, params, m);
}

/**
 * Update a team record based on the given data
 * 
 * @param {name: string} data
*/
 async function updateTeamRecord(data) {
    var invalid = c.simpleValidation(data, {
        team_id: "int",
        group_id: "int",
        fixtures_played: 'int',
        data.goals_for: 'int',
        data.goals_against: 'int',
        data.outcome: 'string' //outcome to be updated i.e wins, ties, or losses
    });
    if (invalid) {
        return invalid;
    }
    var sql =
        "UPDATE teamRecord SET \
        fixtures_played = fixtures_played + 1, \
        goals_for = goals_for + $3,\
        goals_against = goals_against + $4, \
        $5 = $5 + 1 \
        WHERE team=$1 AND group_id=$2 RETURNING *;";
    var params = [data.team_id, data.group, data.goals_for, data.goals_against, data.outcome];
    var m = new c.Message({
        success: "Successfully updated team record.",
    });
    return await c.update(sql, params, m);
}

/**
 * Update a team record based on the given data
 * 
 * @param {name: string} data
 */
 async function setTeamRecord(){
    var invalid = c.simpleValidation(data, {
        team: "int",
        group_id: "int",
        fixtures_played: 'int',
        data.wins: 'int',
        data.losses: 'int',
        data.ties: 'int',
        data.goals_for: 'int',
        data.goals_against: 'int'
    });
    if (invalid) {
        return invalid;
    }
    var sql =
        "UPDATE teamRecord SET \
        fixtures_played = $3, \
        goals_for = $4,\
        goals_against = $5, \
        wins = $6 \
        ties = $7 \
        losses = $8 \
        WHERE team=$1 AND group_id=$2 RETURNING *;";
    var params = [data.team_id, data.group, data.goals_for, data.goals_against, data.wins, data.ties, data.losses];
    var m = new c.Message({
        success: "Successfully set team record.",
    });
    return await c.update(sql, params, m);
}

module.exports = {
    createTeam: createTeam,
    deleteTeam: deleteTeam,
    addPlayer: addPlayer,
    getTeamsByCompetition: getTeamsByCompetition,
    createTeamRecord: createTeamRecord,
    updateTeamRecord: updateTeamRecord,
    setTeamRecord: setTeamRecord,
};
