const program = require("../model/program");
const c = require("./constants");
const isFunction = c.isFunction;
const errorEnum = c.errorEnum;
var faker = require('faker');

/**
 * Insert mock teams into the database
 *
 * @param {int} num_teams
 */
 async function createTeams(num_teams) {
    var sql =
        "INSERT INTO person (first_name, last_name, email, phone, gender, birthday, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;";
    var params = [
        data.first_name,
        data.last_name,
        data.email,
        data.phone,
        data.gender,
        data.birthday,
        "",
    ];
    var m = new c.Message({
        success: "Successfully added a person.",
        duplicate: "A person with email already exists.",
    });
    return await c.create(sql, params, m);
}

/**
 * Insert a mock competition
 *
 * @param {int} num_teams
 */
 async function createTeams(num_teams) {
    var sql =
        "INSERT INTO person (first_name, last_name, email, phone, gender, birthday, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;";
    var params = [
        data.first_name,
        data.last_name,
        data.email,
        data.phone,
        data.gender,
        data.birthday,
        "",
    ];
    var m = new c.Message({
        success: "Successfully added a person.",
        duplicate: "A person with email already exists.",
    });
    return await c.create(sql, params, m);
}