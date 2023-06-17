const { readFileSync } = require('fs');
const mysql2 = require("mysql2");

/**
 * Drop all tables in the DegreeMap database.
 * 
 * @param {mysql2.Connection} connection - MySQL2 Connection Object
 */
async function DropTables(connection) {
	console.log("- Dropping Tables...")
	connection.query(readFileSync("./Queries/DropTables.sql", 'ascii'));
}

module.exports = DropTables;
