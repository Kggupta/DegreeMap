const InsertionOrder = require('../InsertionOrder.json')
const CSVConverter = require('./CSVConverter')
const mysql2 = require("mysql2");

/**
 * Populate the database with the sample dataset (CSV files in DegreeMap/DataFiles/Sample)
 * 
 * @param {mysql2.Connection} connection - MySQL2 Connection Object
 */
async function PopulateSampleData(connection) {
	for (let i = 0; i < InsertionOrder.length; i++) {
		await CSVConverter(`./DataFiles/Sample/${InsertionOrder[i]}.csv`, InsertionOrder[i], connection)
	}
}

module.exports = PopulateSampleData;