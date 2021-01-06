const Client = require('pg').Client;

const db = new Client({
  user: 'maadmin',
  password: 'VeryG00dPa$$word',
  host: 'localhost',
  port: 5432,
  database: 'maadmin'
})

db.connect()
.then(() => console.log('Connected to db successfully'))
.catch(e => console.log(e));

module.exports = db;
