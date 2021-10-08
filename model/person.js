const { setResult } = require("./constants");
const c = require("./constants");

/**
 * Uses the Create operation from ./constants in order to insert a program into the database.
 *
 * @param {name: string} data
 */
async function createPerson(data) {
    if (data.gender && data.gender.toLowerCase() == "male") {
        data.gender = "true";
    } else if (data.gender && data.gender.toLowerCase() == "female") {
        data.gender = "false";
    }
    var invalid = c.simpleValidation(data, {
        first_name: "string",
        last_name: "string",
        email: "email",
        phone: "phone",
        gender: "bool",
        birthday: "date",
    });
    if (invalid) {
        return invalid;
    }
    var sql =
        "INSERT INTO person (first_name, last_name, email, phone, gender, birthday) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;";
    var params = [
        data.first_name,
        data.last_name,
        data.email,
        data.phone,
        data.gender,
        data.birthday,
    ];
    var m = new c.Message({
        success: "Successfully added a person.",
        duplicate: "A person with this email already exists.",
    });
    return await c.create(sql, params, m);
}

/**
 * Uses the remove operation from ./constants in order to remove a program from the database.
 *
 * @param {name: string} data
 */
async function getPerson(data) {
    var sql = "SELECT * from person where email = $1;";
    var params = [data.email];
    var m = new c.Message({
        success: "Successfully retrieved user matching email.",
    });
    var originalData = data;
    return await c.retrieve(sql, params, m).then(async function (result) {
        return result;
    });
}

module.exports = {
    createPerson: createPerson,
    getPerson: getPerson,
};