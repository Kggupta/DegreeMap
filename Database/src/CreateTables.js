const {readFileSync} = require('fs');
const mysql2 = require("mysql2");

/**
 * Create all tables and constraints in the DegreeMap database.
 * 
 * @param {mysql2.Connection} connection - MySQL2 Connection Object
 */
async function CreateTables(connection) {
	console.log("- Creating Tables...")
	connection.query(readFileSync("./Queries/CreateTables.sql", 'ascii'));
}

module.exports = CreateTables;