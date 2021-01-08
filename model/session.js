const program = require("../model/program");
const c = require("./constants");
const isFunction = c.isFunction;
const errorEnum = c.errorEnum;

/**
 * Uses the remove operation from ./constants in order to remove a program from the database.
 * 
 * @param {name: string} data 
 */
async function getSessions(data) {
    var invalid = c.simpleValidation(data, {
        program: "yoga"
    })
    if (invalid) {
        return invalid;
    }
    var sql = 'SELECT * from session where program=$1;';
    var params = [data.program]
    var m = new c.Message({
        success: "Successfully retrieved all sessions.",
        none: "There are no available sessions."
    });
    return await c.retrieve(sql, params, m);
}

module.exports = {
    getSessions: getSessions,
}