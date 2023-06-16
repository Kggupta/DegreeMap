const { readFileSync } = require('fs');

async function DropTables(connection) {
	console.log("- Dropping Tables...")
	connection.query(readFileSync("./Queries/DropTables.sql", 'ascii'));
}

module.exports = DropTables;
