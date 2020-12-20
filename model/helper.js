// These are helper functions and values that will be can be used elswehere in this project.
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

async function fetch(sql, params, none = "No rows found.", success = "Successfully fetched rows.", error = "Failed to fetch rows.") {
  // This function prepares a generic rows fetch based on the inputs

  if (success == "") {
    success = "Successfully fetched rows.";
  }
  if (none = "") {
    none = "No rows found.";
  }
  console.log("-- The following query is being executed --\n sql: " + sql + "\n params: " + params);
  return await db.query(sql, params).then(result => {
    if (result.rows[0] == null) {
      console.log(none);
      return setResult(EMPTY, false, none, errorEnum.DNE);
    }
    console.log(success);
    return setResult(result.rows, true, success, errorEnum.NONE);
  }).catch(e => {
    console.log("\nERROR!\n", error, e);
    return setResult(EMPTY, false, error, errorEnum.UNKNOWN);
  })
}

async function update(sql, params, none = "No rows updated.", success = "Successfully updated rows.", error = "Failed to update rows.") {
  // Note: All update calls must return all columns (i.e. RETURNING *)
  console.log("-- The following query is being executed --\n sql: " + sql + "\n params: " + params);
  return await db.query(sql, params).then(result => {
    if (result.rows[0] == null) {
      return setResult(EMPTY, false, none, errorEnum.DNE);
    }
    return setResult(result.rows, true, success, errorEnum.NONE);
  }).catch(e => {
    console.log("\nUpdate error!\n", error, e);
    return setResult(EMPTY, false, errorEnum.UNKNOWN);

  })
}

function isFunction(functionToCheck) {
  // This is just a helper function that checks if any "callback" functions actually exist

  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
};

module.exports = {
  fetch: fetch,
  setResult: setResult,
  isFunction: isFunction,
  errorEnum: errorEnum,
  EMPTY: EMPTY
}
