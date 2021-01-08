const program = require("../model/program");
const c = require("./constants");
const isFunction = c.isFunction;
const errorEnum = c.errorEnum;

/**
 * Uses the Create operation from ./constants in order to insert a program into the database.
 * 
 * @param {name: string} data
 */
async function subscribe(data) {
    var invalid = c.simpleValidation(data, {
        person: "integer",
        subscription: "integer",
        datetime: "datetime",
        payment: "integer",
        consent: "list"
    })
    if (invalid) {
        return invalid;
    }
    var sql = 'INSERT INTO registration (person, subscription, datetime, payment) VALUES ($1, $2, $3, $4) RETURNING *;';
    var params = [data.person, data.subscription, data.datetime, data.payment]
    var m = new c.Message({
        success: "Registration Successful.",
        duplicate: "You are already registered for this program."
    });
    return await c.create(sql, params, m).then(async function (result) {
        var consents = data.consent;
        if (result.success) {
            for (var i = 0; i < consents.length; i++) {
                var consent_response = await consent({person: data.person, datetime: data.datetime, ...consents[i]});
                if (consent_response.success == false){
                    // In this case, we should also be cancelling the registration
                    // However, we will assume for now that there is nothing wrong with the consent.
                    return consent_response;
                }
            }
        }
        return result;
    })
}

/**
 * Uses the Create operation from ./constants in order to insert a program into the database.
 * 
 * @param {name: string} data
 */
async function consent(data) {
    var invalid = c.simpleValidation(data, {
        person: "integer",
        datetime: "datetime",
        purpose: "string",
        given: "bool"
    })
    if (invalid) {
        return invalid;
    }
    var sql = 'INSERT INTO consent (person, is_given, datetime, purpose) VALUES ($1, $2, $3, $4) RETURNING *;';
    var params = [data.person, data.given, data.datetime, data.purpose]
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
async function getPrograms(data) {
    var invalid = c.simpleValidation(data, {
        person: "integer"
    })
    if (invalid) {
        return invalid;
    }
    var sql = 'SELECT * from personRegistration where person = $1;';
    var params = [data.person];
    var m = new c.Message({
        success: "Successfully retrieved user registration."
    });
    return await c.retrieve(sql, params, m);
}

module.exports = {
    subscribe: subscribe,
    getPrograms: getPrograms,
}