
const h = require("./helper");
const db = require("./db.js");

async function getRoster(teamName) {
    sql = 'SELECT fname, lname, name, email, phone FROM member m JOIN (SELECT * FROM soccerPlayer sp JOIN team t ON t.teamid=sp.team) tsp ON tsp.member=m.id WHERE name=$1;';
    return await h.fetch(sql, [teamName], "No team names have been fetched from the database.",
    "Roster Fetched successfully", "Failed to fetch team roster.");
}

async function getDivStandings(divNum) {
    sql = 'SELECT name, points, fixturesplayed, wins, losses, draws, goalsfor, goalsagainst, goaldifferential FROM team WHERE division=$1 ORDER BY points DESC;';
    return await h.fetch(sql, [divNum], "No team names have been fetched from the database.",
    "Roster Fetched successfully", "Failed to fetch team roster.");
}

module.exports = {
    getRoster: getRoster,
    getDivStandings: getDivStandings
}