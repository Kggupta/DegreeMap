const {Express} = require("express");
const {Connection} = require("mysql2");
const PROCEDURE_ERROR = 45000;
/**
 * Registers all deadline routes
 * 
 * @param {Express} app - The express application
 * @param {Connection} connection - MySQL connection
 */
function DeadlineRoutes(app, connection) {
	// Add deadline
	app.route("/Deadline/add").get((req, res) => {
		const query = `INSERT INTO Deadlines (uid, subject, course_number, name, due_date) VALUES (` +
						`${req.query.uid}, ${connection.escape(req.query.subject)}, ${connection.escape(req.query.course_number)}, ${connection.escape(req.query.name)}, ${connection.escape(req.query.due_date.split('T')[0] + ' 00:00:00')});`

		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				return res.status(400).send('Invalid Deadline.');
			}
			res.sendStatus(200);
		})
	})

	// Remove deadline
	app.route("/Deadline/remove").get((req, res) => {
		const query = `DELETE FROM Deadlines WHERE ` +
		`uid = ${req.query.uid} AND subject = ${connection.escape(req.query.subject)} AND course_number = ${connection.escape(req.query.course_number)} AND name = ${connection.escape(req.query.name)}`

		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				return res.status(400).send('Could not delete deadline.');
			}
			res.sendStatus(200);
		})
	})

	// Get all user deadlines
	app.route("/Deadline/list").get((req,res) => {
		const query = `SELECT * FROM Deadlines WHERE uid = ${req.query.uid};`;
		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				return res.status(400).send('Could not get deadlines.');
			}
			res.json(results);
		})
	})

	// Get deadlines past due
	app.route("/Deadline/pastdue").get((req, res) => {
		const query = "SELECT email, subject, course_number, Deadlines.name AS deadline_name, User.name AS user_name, due_date "+
		"FROM Deadlines "+
		"JOIN User ON Deadlines.uid = User.uid "+
		"WHERE due_date < NOW();";

		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				return res.status(400).send('Could not fetch overdue deadlines.');
			}
			res.sendStatus(results);
		})
	})
	// Remove deadlines past due
	app.route("/Deadline/pastdue/remove").get((req, res) => {
		const query = "DELETE FROM Deadlines WHERE due_date < NOW();";

		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				return res.status(400).send('Could not delete overdue deadlines.');
			}
			res.sendStatus(results);
		})
	})
}

module.exports = DeadlineRoutes;