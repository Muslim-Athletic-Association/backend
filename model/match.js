
const h = require("./helper");
const db = require("./db.js");

async function getRoster(teamName) {
    sql = 'UPDATE team SET  RETURNING *;';
    return await h.fetch(sql, [teamName], "No team names have been fetched from the database.",
    "Roster Fetched successfully", "Failed to fetch team roster.");
}