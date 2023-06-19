const { readFileSync } = require('fs');
const mysql2 = require("mysql2");

/**
 * Add rows in a CSV file to the DegreeMap database
 * 
 * @param {string} fileName - The name of the csv file with the content insert into the table
 * @param {string} tableName - The name of the table in the database
 * @param {mysql2.Connection} connection - MySQL2 Connection object
 */
async function CSVConverter(fileName, tableName, connection) {
	// Read the CSV File to a string
	const table = readFileSync(fileName, 'ascii').split('\n');
	// Print the rows to be added (-1 because of header)
	console.log(`> '${tableName}' - (${table.length - 1} rows)`)

	for (let i = 1; i < table.length; i++) {
		// Add all csv values to table
		connection.query(`INSERT INTO ${tableName} (${table[0]}) VALUES (${table[i]});`);
	}
}

module.exports = CSVConverter;
