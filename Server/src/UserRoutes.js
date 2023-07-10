const {Express} = require("express");
const {Connection} = require("mysql2");
const PROCEDURE_ERROR = 45000;
/**
 * Registers all user routes
 * 
 * @param {Express} app - The express application
 * @param {Connection} connection - MySQL connection
 */
function UserRoutes(app, connection) {
	// Login user given email and password
	// Returns the user object or an error
	app.route('/User/login/').get((req, res) => {
		const email = req.query.email;
		const password = req.query.password;
		const query = `CALL GetUserByEmailAndPassword("${email}","${password}");`;
		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error || results.length == 0) {
				if (error.sqlState == PROCEDURE_ERROR) {
					 return res.status(400).send(error.sqlMessage);
				}
				return res.sendStatus(500);
			}
			res.json(results[0][0]);
		})
	})

	// Get a user by uid
	app.route('/User/').get((req, res) => {
		const uid = req.query.uid;
		const query = `SELECT * FROM User WHERE uid = ${uid} LIMIT 1;`;
		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error || results.length == 0) {
				if (error.sqlState == PROCEDURE_ERROR) {
					 return res.status(400).send(error.sqlMessage);
				}
				return res.sendStatus(500);
			}
			res.json(results[0]);
		})
	})
	
	// Insert user into database and return their user object
	app.route('/User/register/').get((req, res, next) => {
		const body = req.query;
		if (!body) return res.sendStatus(400);

		const email = body.email;
		const name = body.name;
		const password = body.password;
		const level = body.level;

		const query = `CALL InsertUser("${email}", "${name}", "${password}", "${level}");`;
		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				if (error.sqlState == PROCEDURE_ERROR) {
					 return res.status(400).send(error.sqlMessage);
				}
				return res.status(500);
			}
			res.json(results[0])
		})
	})

	// List all users in the database
	app.route('/User/list/').get((req, res, next) => {
		const query = `SELECT * FROM User;`;

		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				if (error.sqlState == PROCEDURE_ERROR) {
					 return res.status(400).send(error.sqlMessage);
				}
				return res.sendStatus(500);
			}
			res.json(results);
		})
	})

	// Deletes a user from the database
	app.route('/User/delete').get((req, res, next) => {
		const uid = req.query.uid;

		const query = `DELETE FROM User WHERE uid = ${uid};`;

		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				if (error.sqlState == PROCEDURE_ERROR) {
					 return res.status(400).send(error.sqlMessage);
				}
				return res.sendStatus(500);
			}
			res.sendStatus(200);
		})
	})

	// Update some of user details such as name, password, level
	app.route('/User/update').get((req, res) => {
		const uid = req.query.uid;

		const body = req.query;
		if (!body) return res.sendStatus(400);

		const name = body.name;
		const password = body.password;
		const level = body.level;

		if (!name || !password || !level) {
			return res.sendStatus(400).send('Invalid body.');
		}

		var query = `UPDATE User SET `;
		query += `name = "${name}", `
		query += `password = "${password}", `
		query += `level = "${level}" `
		query += `\nWHERE uid = ${uid};`
		
		console.log(query);
		connection.query(query, (error, results) => {
			if (error) {
				if (error.sqlState == PROCEDURE_ERROR) {
					 return res.sendStatus(400).send(error.sqlMessage);
				}
				return res.sendStatus(500);
			}
			res.sendStatus(200);
		})
	})

	// Promote a user to administrator
	// Requires source to be administrator or else it will return an error
	app.route('/User/admin').get((req, res) => {
		const uid = req.query.uid;
		const source = req.query.source;


		if (!uid || !source) {
			return res.sendStatus(400).send('Invalid query.');
		}

		var query = `CALL UpdateUserAdminPermission(${uid}, ${source})`;
		
		console.log(query);
		connection.query(query, (error, results) => {
			if (error) {
				if (error.sqlState == PROCEDURE_ERROR) {
					 return res.sendStatus(400).send(error.sqlMessage);
				}
				return res.sendStatus(500);
			}
			res.sendStatus(200);
		})
	})
}

module.exports = UserRoutes;