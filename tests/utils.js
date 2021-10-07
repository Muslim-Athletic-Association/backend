require("dotenv").config();
const Client = require("pg").Client;

const dbConfig = {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
};

async function dbConnect(db) {
    let retries = 5;
    while (retries) {
        db = new Client(dbConfig);
        await db
            .connect()
            .then(() => {
                console.log("Connected to db successfully");
                retries = 0;
                return;
            })
            .catch(async (err) => {
                console.log("Could not connect to db, retrying", err);
                retries--;
                console.log(`retries left: ${retries}`);
                // wait 5 seconds
                await new Promise((res) => setTimeout(() => res(), 3000));
            });
    }
}

const API_URL = "http://localhost:3001"; // This should be an env variable.

async function apiPOST(path, body = {}) {
    return await fetch(API_URL + path, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

async function apiGET(path) {
    return await fetch(API_URL + path);
}

module.exports = {
    apiGET: apiGET,
    apiPOST: apiPOST,
    dbConnect: dbConnect,
    dbConfig: dbConfig,
};
