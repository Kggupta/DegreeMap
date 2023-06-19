const {readFileSync} = require('fs');
const mysql2 = require("mysql2");

/**
 * Create the DegreeMap database.
 * 
 * @param {mysql2.Connection} connection - MySQL2 Connection Object
 */
async function CreateDatabase(connection) {
	connection.query(readFileSync("./Queries/CreateDatabase.sql", 'ascii'));
}

module.exports = CreateDatabase;