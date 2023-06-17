const mysql2 = require('mysql2');
const Usage = "node PopulateData.js [sample/prod]\n- Ex: node PopulateData.js sample";
const SAMPLE = "sample";
const PROD = "prod";
const Environments = [SAMPLE, PROD];
const WhichEnvironment = process.argv[2].toLowerCase();

// Add the environment variables we need (TOKEN, USERNAME, etc.)
require('dotenv').config()

const CreateTables = require('./src/CreateTables');
const DropTables = require('./src/DropTables');
const PopulateSampleData = require('./src/PopulateSampleData');
const PopulateProductionData = require('./src/PopulateProductionData');
const CreateTriggers = require('./src/CreateTriggers');

// If the argument is incorrect, show the usage guide
if (process.argv.length < 3 || !Environments.includes(WhichEnvironment)) {
	console.log(Usage)
	return;
}

async function PopulateData() {
	// Create the MySQL connection based on the environment variables
	const connection = mysql2.createConnection({
		host: process.env.HOST,
		port: process.env.PORT,
		database: process.env.DATABASE_NAME,
		user: process.env.USERNAME,
		password: process.env.PASSWORD,
		multipleStatements: true
	});

	// Drop all tables in the database
	await DropTables(connection);

	// Re-create all the database tables
	await CreateTables(connection);

	// Add triggers
	await CreateTriggers(connection);
	
	switch (WhichEnvironment) {
		case SAMPLE:
			// Populate the database with the sample csv files if the argument was 'sample'
			await PopulateSampleData(connection);
			break;
		default:
			// If the argument was 'prod', populate against the production data
			await PopulateProductionData(connection);
			break;
	}

	// Close the database connection
	connection.end();

	console.log("-----------------------------------\nFinished!")
}

console.log(`LOADING ${WhichEnvironment.toUpperCase()} DATA\n-----------------------------------`)
PopulateData();
