const isFunction = require("./helper").isFunction;
const db = require("./db.js");
const { getMember } = require("./member");
// const checkout = require("./checkout");

const errorEnum = {
    NONE: 0,
    UNIQUE: 1,
    UNKNOWN: 2,
    DNE: 3
}

EMPTY = {};

function setResult(d, pass, msg, code) {
    return { data: d, error: msg, success: pass, ecode: code };
}

module.exports.getDivisions = async function getDivisions() {
    var data = {};
    sql = 'SELECT * FROM division;';
    return await db.query(sql).then(result => {
        if (result.rows[0] == null) {
            console.log("No divisions have been fetched from the database.");
            return setResult(EMPTY, false, "No divisions could be fetched from the database.", errorEnum.DNE);
        }
	for (var r = 0; r< result.rows.length; r++){
		data[r+1] = new Division(result.rows[r]);
	}
        return setResult(data, true, "Divisions names fetched.", errorEnum.NONE);
    }).catch(e => {
        console.log("\nERROR! in getDivisions\n", e);
        return setResult(EMPTY, false, "Failed to fetch Divisions.", errorEnum.UNKNOWN);
    })
}

module.exports.addPlayer = async function addPlayer(data) {
    return await getTeam(data).then(async function (res) {
        console.log("OOOOOOOFFFFFFF::::::: ", res)
        sql = 'INSERT INTO soccerPlayer (member, program, division, team) VALUES ($1, $2, $3, $4) RETURNING *;';
        return await db.query(sql, [data.member, data.program, data.division, res.data.info.teamid]).then(result => {
            return setResult(result.rows, true, "Player created.", errorEnum.NONE);
        }).catch(e => {
            if (e.code == '23505') {
                console.log("\n NOTICE: \n Player stats have already been created for this individual. \n");
                return setResult(result.rows, false, "This player has already been registered.", errorEnum.NONE);
            }
            console.log("\nERROR! in getTeamNames\n", e);
            return setResult(EMPTY, false, "Failed to fetch team names.", errorEnum.UNKNOWN);
        })
    });
}

module.exports.getTeamNames = async function getTeamNames() {
    var teams = {};
    sql = 'SELECT name FROM team;';
    return await db.query(sql).then(result => {
        if (result.rows[0] == null) {
            console.log("No team names have been fetched from the database.");
            return setResult(EMPTY, false, "No team names could be fetched from the database.", errorEnum.DNE);
        }
        return setResult(result.rows, true, "Team names fetched.", errorEnum.NONE);
    }).catch(e => {
        console.log("\nERROR! in getTeamNames\n", e);
        return setResult(EMPTY, false, "Failed to fetch team names.", errorEnum.UNKNOWN);
    })
}

module.exports.getPaidTeams = async function getPaidTeams() {
    var teams = {};
    sql = 'SELECT * FROM teams WHERE paid=\'t\'';
    return await db.query(sql).then(result => {
        if (result.rows[0] == null) {
            console.log("There are no teams that have paid yet.");
            respond(divisions);
            return;
        }
        result.rows.forEach(team => {
            teams[team.name] = new Team(team);
            console.log("Successfully fetched paid team " + team.name);
        })
        return teams;
    }).catch(e => {
        console.log("\nLEAGUE FETCH ERROR!\n", e);
        return e;
    })
}

module.exports.getUnpaidTeams = async function getDivisions() {
    var teams = {};
    sql = 'SELECT * FROM teams WHERE paid=\'f\'';
    return await db.query(sql).then(result => {
        if (result.rows[0] == null) {
            console.log("There are no teams registered yet.");
            respond(divisions);
            return;
        }
        result.rows.forEach(team => {
            teams[team.name] = new Team(team);
            console.log("Successfully fetched unpaid team " + team.name);
        })
        return teams;
    }).catch(e => {
        console.log("\nLEAGUE FETCH ERROR!\n", e);
        return e;
    })
}

module.exports.getPlayers = async function getPlayers() {
    var players = {};
    sql = 'SELECT * FROM soccerPlayer JOIN member ON member.id = soccerPlayer.member;';
    return await db.query(sql).then(result => {
        if (result.rows[0] == null) {
            console.log("There are no players registered");
            respond(players);
            return players;
        }
        result.rows.forEach(player => {
            players[player.pid] = player;
            console.log("Successfully fetched player with id " + player.pid);
        })
        return players;
    }).catch(e => {
        console.log("\nPLAYER FETCH ERROR!\n", e);
        return e;
    })
}

async function getPlayer(id) {
    var teams = {};
    sql = 'SELECT * FROM soccerPlayer WHERE member=$1;';
    return await db.query(sql, [id]).then(result => {
        if (result.rows[0] == null) {
            console.log("No player stats for this member.");
            return setResult(EMPTY, false, "No player stats for this member.", errorEnum.DNE);
        }
        return setResult(result.rows[0], true, "Failed to fetch teams.", errorEnum.NONE);
    }).catch(e => {
        console.log("\nERROR! in getPlayer\n", e);
        return setResult(EMPTY, false, "Failed to fetch soccer player.", errorEnum.UNKNOWN);
    })
}

async function getTeam(data) {
    sql = 'SELECT * FROM team WHERE name=$1 and program=$2;';
    return await db.query(sql, [data.name, data.program]).then(result => {
        if (result.rows[0] == null) {
            return setResult(EMPTY, false, "There seems to be nothing in the team table.", errorEnum.DNE);
        }
        team = new Team(result.rows[0])
        return setResult(team, true, "Successfully fetched a team.", errorEnum.NONE);
    }).catch(e => {
        console.log("\nTEAM FETCH ERROR!\n", e);
        return setResult(EMPTY, false, "Error in getTeam.", errorEnum.UNKNOWN);

    })
}

module.exports.setPaid = async function setPaid(data) {
    sql = 'UPDATE team SET paid=\'t\' WHERE teamId=$1 RETURNING *;';
    return await db.query(sql, [data.teamid]).then(result => {
        if (result.rows[0] == null) {
            return setResult(EMPTY, false, "There doesn't seem to be a team by that name.", errorEnum.DNE);
        }
        team = new Team(result.rows[0])
        return setResult(team, true, "Team Payment successfully recorded.", errorEnum.NONE);
    }).catch(e => {
        console.log("\nPayment recording error!\n", e);
        return setResult(EMPTY, false, "Error while recording payment.", errorEnum.UNKNOWN);

    })
}

async function getTeamByMember(data) {
    sql = 'SELECT * FROM team t JOIN soccerplayer sp ON t.teamId=sp.team and sp.member=$1;';
    return await db.query(sql, [data.member]).then(result => {
        if (result.rows[0] == null) {
            return setResult(EMPTY, false, "There doesn't seem to be a team that this member is on.", errorEnum.DNE);
        }
        return setResult(result.rows[0], true, "Team fetched based on member id.", errorEnum.NONE);
    }).catch(e => {
        console.log("\nCould not get Team by member!\n", e);
        return setResult(EMPTY, false, "Unable to fetch team by member id.", errorEnum.UNKNOWN);
    })
}

async function getCaptainbyTeam(data) {
    sql = 'SELECT * FROM member JOIN team t ON member.id=t.captain WHERE t.name=$1;';
    return await db.query(sql, [data.info.name]).then(result => {
        if (result.rows[0] == null) {
            return setResult(EMPTY, false, "Unable to fetch team .", errorEnum.DNE);
        }
        return setResult(result.rows[0], true, "Member successfully fetched by team id.", errorEnum.NONE);
    }).catch(e => {
        console.log("\nCould not fetch member by team id!\n", e);
        return setResult(EMPTY, false, "Unable to fetch member by team id.", errorEnum.UNKNOWN);
    })
}

class Division {
    constructor(data) {
        this.info = data;
        this.teams = {};
    }

    full(name) {
        return Object.keys(this.teams).length >= this.info.capacity;
    }

    async addTeam(data) {
        //Add a team to the division if there is space in the division.
        var div = this;
        return await getMember(data).then(async function addTeamResponse(result) {
            data["division"] = div.info.division;
            var id = result.data.id;
            data["member"] = id;
            var player = await getPlayer(data.member).then((result) => {
                return result;
            })
            if (player.success) {
                return await getTeamByMember(data).then((result) => {
                    var emsg = "A member by the name of " + data.fname + " " +
                        data.lname + " has been registered as a player for " + result.data.name
                    return setResult(result.data, false, emsg, errorEnum.UNIQUE);
                });
            }
            var sql = 'INSERT INTO team (name, division, program, captain) VALUES ($1, $2, $3, $4) RETURNING *;';
            return await db.query(sql, [data.name, div.info.division, data.program, result.data.id]).then(async function (result) {
                var tInfo = { ...data, teamid: result.rows[0].teamid };
                var team = new Team(tInfo);
                var captainResult = await team.addCaptain(team, true).then((result) => { return result });
                if (captainResult.success) {
                    div.teams[data.name] = team;
                    var emsg = "A player by the name of " + data.fname + " " +
                        data.lname + " has been registered as captain of " + data.name
                    // await checkout.createOrder(data);
                    return setResult(team, true, "Successfully added team.", errorEnum.UNIQUE);
                } else {
                    return captainResult;
                }
            }).catch(e => {
                if (e.code == '23505') {
                    console.log("\nNOTICE: Team is a duplicate. \n");
                    return getTeam(data).then(async function teamCallback(result) {
                        return result;
                    }).then(async function (result) {
                        return await getCaptainbyTeam(result.data).then((result) => {
                            var emsg = "A player by the name of " + result.data.fname + " " +
                                result.data.lname + " has been registered as captain of " + result.data.name
                            return setResult(result.data, false, emsg, errorEnum.UNIQUE);
                        })
                    });
                }
                console.log(e);
                return setResult(EMPTY, false, "Some sort of error while adding team.", errorEnum.UNKNOWN);
            })
        });
    }

}

class Team {
    constructor(data) {
        this.info = data;
    }

    async addCaptain(data) {
        var team = this;
        return await this.createPlayerStats(data.info.program, data.info.division, data.info.member).then(async function cpsCallBack(result) {
            return result;
        })
    }

    async createPlayerStats(program, div, member) {
        //Creates a players default stats while indicating the program and division they belong to
        var sql = "INSERT INTO soccerPlayer (program, division, member, team) VALUES ($1, $2, $3, $4) RETURNING *;"
        return await db.query(sql, [program, div, member, this.info.teamid]).then(res => {
            console.log("Created Stats for member with ID " + member + " in " + program + " division " + div);
            return setResult({ team: this, member: res.rows[0].member }, true, "Successfully Created Player Stats.", errorEnum.NONE);
        }).catch(async function (e) {
            if (e.code == '23505') {
                console.log("\n NOTICE: \n Player stats have already been created for this individual. \n");
                return await getPlayer(member).then((result) => {
                    if (result.success) {
                        return setResult({ team: this, member: result.data.member }, true, "Did not create player stats because player already exists.", errorEnum.UNIQUE);
                    } else {
                        return result;
                    }
                });

            }
            console.log(e);
            return setResult(EMPTY, false, "Error in playerstats.", errorEnum.UNKOWN);
        })
    }

}

module.exports.Team = Team;
module.exports.Division = Division;
