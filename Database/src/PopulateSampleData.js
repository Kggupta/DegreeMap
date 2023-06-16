const InsertionOrder = require('../InsertionOrder.json')
const CSVConverter = require('./CSVConverter')

async function PopulateSampleData(connection) {
	for (let i = 0; i < InsertionOrder.length; i++) {
		await CSVConverter(`./DataFiles/Sample/${InsertionOrder[i]}.csv`, InsertionOrder[i], connection)
	}
}

module.exports = PopulateSampleData;