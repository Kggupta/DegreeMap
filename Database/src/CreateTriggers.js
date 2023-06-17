const {readFileSync} = require('fs');
const mysql2 = require("mysql2");

/**
 * Create all triggers in the DegreeMap database.
 * 
 * @param {mysql2.Connection} connection - MySQL2 Connection Object
 */
async function CreateTriggers(connection) {
	console.log("- Creating Triggers...")
	connection.query(readFileSync("./Queries/CreateTriggers.sql", 'ascii'));
}

module.exports = CreateTriggers;