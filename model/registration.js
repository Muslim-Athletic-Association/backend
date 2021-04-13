const program = require("../model/program");
const c = require("./constants");
const e = require("express");
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
    consent: "list",
  });
  if (invalid) {
    return invalid;
  }
  var sql =
    "INSERT INTO registration (person, subscription, datetime, payment) VALUES ($1, $2, $3, $4) RETURNING *;";
  var params = [data.person, data.subscription, data.datetime, data.payment];
  var m = new c.Message({
    success: "Registration Successful.",
    duplicate: "You are already registered for this program.",
  });
  return await c.create(sql, params, m).then(async function (result) {
    var consents = data.consent;
    var consent_responses = [];
    for (var i = 0; i < consents.length; i++) {
      var consent_response = await consent({
        person: data.person,
        datetime: data.datetime,
        ...consents[i],
      });
      if (
        consent_response.success == false &&
        consent_response.ecode != c.errorEnum.UNIQUE
      ) {
        // In this case, we should also be cancelling the registration
        // However, we will assume for now that there is nothing wrong with the consent.
        return consent_response;
      }
      consent_responses.push(consent_response);
    }
    result = { ...result, consent_responses: consent_responses };
    var guardian_response = {};
    if (Object.keys(data).includes("guardian") && data["guardian"]) {
      guardian_response = await addGuardian({
        ...data["guardian"],
        person: data.person,
      });
    }
    result = { ...result, guardian_responses: { ...guardian_response } };
    return result;
  });
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
    given: "bool",
  });
  if (invalid) {
    return invalid;
  }
  var sql =
    "INSERT INTO consent (person, is_given, datetime, purpose) VALUES ($1, $2, $3, $4) RETURNING *;";
  var params = [data.person, data.given, data.datetime, data.purpose];
  var m = new c.Message({
    success: "Successfully added consent.",
    duplicate:
      'The consent with purpose: "' +
      data.purpose +
      '" has already been given.',
  });
  return await c.create(sql, params, m);
}

/**
 * Uses the Create operation from ./constants in order to insert a program into the database.
 *
 * @param {name: string} data
 */
async function addGuardian(data) {
  var invalid = c.simpleValidation(data, {
    person: "integer",
    full_name: "string",
    email: "email",
    phone: "phone",
  });
  if (invalid) {
    return invalid;
  }
  var sql =
    "INSERT INTO guardian (person, full_name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *;";
  var params = [data.person, data.full_name, data.email, data.phone];
  var m = new c.Message({
    success: "Successfully added guardian.",
    duplicate: "You already have a guardian with that email and phone #.",
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
    person: "integer",
  });
  if (invalid) {
    return invalid;
  }
  var sql = "SELECT * from personRegistration where person = $1;";
  var params = [data.person];
  var m = new c.Message({
    success: "Successfully retrieved user registration.",
  });
  return await c.retrieve(sql, params, m);
}

/**
 * Responds with the session zoom link and whatsapp link when given a registered email
 *
 * @param {name: string} data
 */
async function checkReg(data) {
  var invalid = c.simpleValidation(data, {
    email: "email",
  });
  if (invalid) {
    return invalid;
  }
  var sql = "SELECT * from ramadanRegistered where email = $1;";
  var params = [data.email];
  var m = new c.Message({
    success: "This email is registered for Ramadan Wellness",
    none: "This email is not registered for Ramadan Wellness",
  });
  return await c.retrieve(sql, params, m).then(async (result) => {
    if (result.success) {
        return c.setResult(
        {
          zoom_link: "https://utoronto.zoom.us/j/3758796274",
          whatsapp_link: "",
        },
        true,
        result.error,
        c.errorEnum.NONE
      );
    }
    return result;
  });
}

module.exports = {
  subscribe: subscribe,
  getPrograms: getPrograms,
  checkReg: checkReg,
};
