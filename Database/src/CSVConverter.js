const { readFileSync } = require('fs');

async function CSVConverter(fileName, tableName, connection) {
	const table = readFileSync(fileName, 'ascii').split('\n');
	console.log(`> '${tableName}' - (${table.length - 1} rows)`)

	for (let i = 1; i < table.length; i++) {
		const rowData = table[i].split(',');
		let queryBuilding = `INSERT INTO ${tableName} (${table[0]}) VALUES (`;
		
		for (let t = 0; t < rowData.length; t++) {
			queryBuilding += rowData[t];
			if (t != rowData.length - 1) queryBuilding += ", "
		}

		queryBuilding += ");"
		connection.query(queryBuilding);
	}
}

module.exports = CSVConverter;
