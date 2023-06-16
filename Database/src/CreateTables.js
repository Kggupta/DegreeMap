const {readFileSync} = require('fs');

async function CreateTables(connection) {
	console.log("- Creating Tables...")
	connection.query(readFileSync("./Queries/CreateTables.sql", 'ascii'));
}

module.exports = CreateTables;