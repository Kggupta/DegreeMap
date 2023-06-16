const mysql2 = require('mysql2');
const Usage = "node PopulateData.js [sample/prod]\n- Ex: node PopulateData.js sample";
const SAMPLE = "sample";
const PROD = "prod";
const Environments = [SAMPLE, PROD];
const WhichEnvironment = process.argv[2].toLowerCase();

require('dotenv').config()

const CreateTables = require('./src/CreateTables');
const DropTables = require('./src/DropTables');
const PopulateSampleData = require('./src/PopulateSampleData');

if (process.argv.length < 3 || !Environments.includes(WhichEnvironment)) {
	console.log(Usage)
	return;
}

async function PopulateData() {
	const connection = mysql2.createConnection({
		host: process.env.HOST,
		port: process.env.PORT,
		database: process.env.DATABASE_NAME,
		user: process.env.USERNAME,
		password: process.env.PASSWORD,
		multipleStatements: true
	});

	await DropTables(connection);
	await CreateTables(connection);
	
	if (WhichEnvironment == SAMPLE)
		await PopulateSampleData(connection);
	else
		console.log("TO-DO");

	connection.end();

	console.log("-----------------------------------\nFinished!")
}
console.log(`LOADING ${WhichEnvironment.toUpperCase()} DATA\n-----------------------------------`)
PopulateData();
