const program = require("../model/program");
const c = require("./constants");
const isFunction = c.isFunction;
const errorEnum = c.errorEnum;

/**
 * Uses the Create operation from ./constants in order to insert a program into the database.
 * 
 * @param {name: string} data 
 */
async function createProgram(data) {
    var invalid = c.simpleValidation(data, {
        name: "string"
    })
    if (invalid) {
        return invalid;
    }
    var sql = 'INSERT INTO program (name) VALUES ($1) RETURNING *;';
    var params = [data.name]
    var m = new c.Message({
        success: "Successfully created program.",
        duplicate: "A program with that name already exists."
    });
    return await c.create(sql, params, m);
}

/**
 * Uses the remove operation from ./constants in order to remove a program from the database.
 * 
 * @param {name: string} data 
 */
async function deleteProgram(data) {
    var invalid = c.simpleValidation(data, {
        name: "string"
    })
    if (invalid) {
        return invalid;
    }
    var sql = 'DELETE FROM program WHERE name=$1 RETURNING *;';
    var params = [data.name]
    var m = new c.Message({
        success: "Successfully removed program."
    });
    return await c.create(sql, params, m);
}

/**
 * Uses the remove operation from ./constants in order to remove a program from the database.
 * 
 * @param {name: string} data 
 */
async function getPrograms(data) {
    var sql = 'SELECT * from program;';
    var params = []
    var m = new c.Message({
        success: "Successfully retrieved all programs."
    });
    return await c.retrieve(sql, params, m);
}

module.exports = {
    createProgram: createProgram,
    deleteProgram: deleteProgram,
    getPrograms: getPrograms,
}