const mysql2 = require ('mysql2');

var connection = new mysql2.createConnection({
	host: process.env.HOST,
	port: process.env.PORT,
	database: process.env.DATABASE_NAME,
	user: process.env.APPUSERNAME,
	password: process.env.PASSWORD,
	multipleStatements: true
});

connection.connect(function (err) {
  if (err) {
    console.log ('Could not connect');
    throw err;
  } else {
    console.log ('Connected to database.');
  }
});

module.exports = connection;