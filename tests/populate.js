const c = require("../model/constants");
const isFunction = c.isFunction;
const errorEnum = c.errorEnum;
var faker = require("faker");

sql =
    "SELECT * FROM (\
\
    SELECT\
        pgc.contype as constraint_type,\
        pgc.conname as constraint_name,\
        ccu.table_schema AS table_schema,\
        kcu.table_name as table_name,\
        kcu.COLUMN_NAME as column_name, \
        ccu.TABLE_NAME as reference_table,\
        ccu.COLUMN_NAME as reference_col,\
        CASE WHEN (pgc.contype = 'p') THEN 'yes' ELSE 'no' END as auto_inc,\
        CASE WHEN (pgc.contype = 'p') THEN 'NO' ELSE 'YES' END as is_nullable,\
    \
            'integer' as data_type,\
            '0' as numeric_scale,\
            '32' as numeric_precision\
    FROM\
        pg_constraint AS pgc\
        JOIN pg_namespace nsp ON nsp.oid = pgc.connamespace\
        JOIN pg_class cls ON pgc.conrelid = cls.oid\
        JOIN information_schema.key_column_usage kcu ON kcu.constraint_name = pgc.conname\
        LEFT JOIN information_schema.constraint_column_usage ccu ON pgc.conname = ccu.CONSTRAINT_NAME \
        AND nsp.nspname = ccu.CONSTRAINT_SCHEMA\
     \
     UNION\
     \
        SELECT  null as constraint_type , null as constraint_name , 'public' as \"table_schema\" ,\
        table_name , column_name, null as refrence_table , null as refrence_col , 'no' as auto_inc ,\
        is_nullable , data_type, numeric_scale , numeric_precision\
        FROM information_schema.columns cols \
        Where 1=1\
        AND table_schema = 'public'\
        and column_name not in(\
            SELECT CASE WHEN (pgc.contype = 'f') THEN kcu.COLUMN_NAME ELSE kcu.COLUMN_NAME END \
            FROM\
            pg_constraint AS pgc\
            JOIN pg_namespace nsp ON nsp.oid = pgc.connamespace\
            JOIN pg_class cls ON pgc.conrelid = cls.oid\
            JOIN information_schema.key_column_usage kcu ON kcu.constraint_name = pgc.conname\
            LEFT JOIN information_schema.constraint_column_usage ccu ON pgc.conname = ccu.CONSTRAINT_NAME \
            AND nsp.nspname = ccu.CONSTRAINT_SCHEMA\
        )\
    )   as foo\
    \
    ORDER BY table_name desc";

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

async function crazy_stuff() {
    // let sql =
    //     "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';";
    let params = [];
    return await c.retrieve(sql, params).then(async (query) => {
        let tables = {};
        // console.log(query);
        let falafel = query.data.forEach(async (table_data) => {
            console.log(table_data);
            if (!(table_data["table_name"] in tables)) {
                tables[table_data["table_name"]] = [];
            }
            col = [];
            col.push({
                reference_table: table_data["reference_table"],
                reference_col: table_data["reference_col"],
                is_nullable: table_data["is_nullable"],
                data_type: table_data["data_type"],
                constraint_name: table_data["constraint_name"],
                constraint_type: table_data["constraint_type"],
            });
            if (table_data["constraint_type"] == "u") {
                col = table_data["constraint_name"].split("_");
                let index = col.indexOf("key");
                if (index > -1) {
                    col.splice(index, 1);
                }
                tables[table_data["table_name"]][
                    `unique constraint: ${table_data["constraint_name"]}`
                ] = col;
                // console.log(table_data["table_name"]);
                // console.log(tables[table_data["table_name"]]);
            } else {
                // if (column) {
                //     console.log(table_data["column_name"]);
                //     console.log(table_data);
                //     tables[table_data["table_name"]][table_data["column_name"]] =
                //         column.push(...col);
                // } else {
                tables[table_data["table_name"]][table_data["column_name"]] =
                    col;
            }
            // }
        });
        // console.log(tables);
        return tables;
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

module.exports = {
    getAllTableInfo: getAllTableInfo,
    crazy_stuff: crazy_stuff,
};
