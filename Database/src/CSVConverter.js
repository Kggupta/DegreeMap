const { readFileSync } = require('fs');

async function CSVConverter(fileName, tableName, connection) {
	const table = readFileSync(fileName, 'ascii').split('\n');
	console.log(`> '${tableName}' - (${table.length - 1} rows)`)

	for (let i = 1; i < table.length; i++) {
		connection.query(`INSERT INTO ${tableName} (${table[0]}) VALUES (${table[i]});`);
	}
}

module.exports = CSVConverter;
