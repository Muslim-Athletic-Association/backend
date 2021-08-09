const c = require("../model/constants");
const isFunction = c.isFunction;
const errorEnum = c.errorEnum;
var faker = require("faker");

// Objective: Prompt user with how much fake data they want in each table.

async function getTableInformation(table_name) {
    let sql =
        "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1;";
    var params = [table_name];
    return await c.retrieve(sql, params);
}

async function getAllTableInfo() {
    let sql =
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';";
    let params = [];
    return await c.retrieve(sql, params).then(async (query) => {
        let num_tables = query.data.length;
        console.log(`There are ${num_tables} tables in total.`);
        let falafel = await Promise.all(
            query.data.map(async (table_data) => {
                let table_name = table_data["table_name"];
                let table_columns = await getTableInformation(table_name);
                console.log(table_columns);
                let tbl = {};
                tbl[table_name] = {};
                let name_to_type = table_columns.data.forEach((column) => {
                    let name = column.column_name;
                    let ntt = {};
                    ntt[name] = column.data_type;
                    tbl[table_name] = { ...tbl[table_name], ...ntt };
                    return ntt;
                });
                return tbl;
            })
        );
        console.log(falafel);
        return falafel;
    });
}

/**
 * Create n rows of mock data
 *
 * @param {int} n
 * @param {string} table_name
 * @param {column_name: column_type} table_name
 */
function createMockRows(n, table_name, table_params) {}

/**
 * Prompt the user on which table(s) they would like to mock data for.
 */
function promptUser() {}

getAllTableInfo().then((tables) => console.log(tables));

module.exports = { getAllTableInfo: getAllTableInfo };
