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
        "INSERT INTO team (team_name, captain, team_capacity, color) VALUES ($1, $2, $3, $4) RETURNING *;";
    var params = [data.team_name, data.person, data.team_capacity, data.color];
    var m = new c.Message({
        success: "Successfully created team. ",
        duplicate:
            "A team with that name already exists, choose another team name.",
        foreign: "Captain must log in first in order to create a team.",
    });
    console.log(data)
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
                createTeamRecord({...result2.data[0], group_id: data.group_id})
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
        compTitle: "string",
    });
    if (invalid) {
        return invalid;
    }

    var sql = "select * from teamCompetition where title=$1;";
    var params = [data.compTitle];
    var m = new c.Message({
        success: "Successfully retrieved all teams.",
    });
    return await c.retrieve(sql, params, m);
}

/**
 * Fetches all of the teams players for a league based on the league's title.
 *
 * Please note: at the beginning of a season, teams may all be
 * placed into the same initial group.
 *
 * @param {name: string} data
 */
 async function getPlayersByCompetition(data) {
    var invalid = c.simpleValidation(data, {
        compTitle: "string",
    });
    if (invalid) {
        return invalid;
    }

    var sql = "select r.team, first_name, last_name, email, phone, birthday, player_id, person_id from roster r join teamCompetition tc on r.team=tc.team_name where title=$1;";
    var params = [data.compTitle];
    var m = new c.Message({
        success: "Successfully retrieved all teams.",
    });
    return await c.retrieve(sql, params, m);
}

/**
 * Fetches all of the team captains registered for a league based on the league's title.
 *
 * @param {name: string} data
 */
 async function getCaptainsByCompetition(data) {
    var invalid = c.simpleValidation(data, {
        compTitle: "string",
    });
    if (invalid) {
        return invalid;
    }

    var sql =
        "select team_name, first_name, last_name, email, phone, color from teamCompetition tc join person p on p.person_id=tc.captain where title=$1;";
    var params = [data.compTitle];
    var m = new c.Message({
        success: `Successfully retrieved all team captains for ${data.compTitle}.`,
    });
    return await c.retrieve(sql, params, m);
}

/**
 * Fetches all of the teams registered for a league based on the league's title.
 *
 * @param {name: string} data
 */
 async function getTeamByCaptain(data) {
    var invalid = c.simpleValidation(data, {
        captain: "email",
    });
    if (invalid) {
        return invalid;
    }

    var sql = "select * from team join person on captain=person_id WHERE email=$1;";
    var params = [data.captain];
    var m = new c.Message({
        success: "Successfully retrieved teams by captain email.",
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
        goals_for: 'int',
        goals_against: 'int',
        outcome: 'string' //outcome to be updated i.e wins, ties, or losses
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
        wins: 'int',
        losses: 'int',
        ties: 'int',
        goals_for: 'int',
        goals_against: 'int'
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
    getPlayersByCompetition: getPlayersByCompetition,
    getCaptainsByCompetition: getCaptainsByCompetition,
    getTeamByCaptain: getTeamByCaptain,
    createTeamRecord: createTeamRecord,
    updateTeamRecord: updateTeamRecord,
    setTeamRecord: setTeamRecord,
};
