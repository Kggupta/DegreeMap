const {Express} = require("express");
const {Connection} = require("mysql2");
const PROCEDURE_ERROR = 45000;

/**
 * Registers all graded content routes
 * 
 * @param {Express} app - The express application
 * @param {Connection} connection - MySQL connection
 */
function GradedContent(app, connection) {
	// Get graded content for course
	app.route('/GradedContent/course/').get((req, res) => {
		const query = "SELECT * FROM GradedContent WHERE " + 
		`uid = ${req.query.uid} AND subject = "${req.query.subject}" AND ` + 
		`course_number = "${req.query.course_number}";`
		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				return res.sendStatus(500);
			}
			res.json(results);
		})
	})

	// Insert graded content
	app.route('/GradedContent/insert/').get((req, res) => {
		const query = `INSERT INTO GradedContent(uid, subject, course_number, name, grade, weight) VALUES ` +
		`(${req.query.uid}, ${connection.escape(req.query.subject)}, ${connection.escape(req.query.course_number)}, ${connection.escape(req.query.name)}, ${req.query.grade}, ${req.query.weight});`
		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				console.log(error)
				return res.status(400).send('Weights must add up to 100 or less.');
			}
			res.sendStatus(200);
		})
	})

	// Delete graded content
	app.route('/GradedContent/delete/').get((req, res) => {
		const query = `DELETE FROM GradedContent WHERE ` + 
		`uid = ${req.query.uid} AND subject = ${connection.escape(req.query.subject)} AND course_number=${connection.escape(req.query.course_number)} AND name = ${connection.escape(req.query.name)}`
		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				return res.status(400).send('Could not delete graded content.')
			}
			res.sendStatus(200);
		})
	})

	// Estimate course grade so far
	app.route('/GradedContent/estimate/').get((req, res) => {
		const query = `CALL GetUserEstimatedGrade(${req.query.uid}, ${connection.escape(req.query.subject)}, ${connection.escape(req.query.course_number)});`
		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				if (error.sqlState == PROCEDURE_ERROR) {
                    return res.status(400).send(error.sqlMessage);
                }
				return res.status(500).send('Could not estimate grade.')
			}
			res.json(results);
		})
	})
}

module.exports = GradedContent;