const {Express} = require("express");
const {Connection} = require("mysql2");
const PROCEDURE_ERROR = 45000;
/**
 * Registers all schedule routes
 * 
 * @param {Express} app - The express application
 * @param {Connection} connection - MySQL connection
 */
function ScheduleRoutes(app, connection) {
	// Get course sections user is attending
	app.route('/Section/attending/').get((req, res) => {
		const query = "SELECT S.subject, S.course_number, S.section, S.type, P.name AS professor_name,"
		+ " S.days, S.start_time, S.end_time, S.location_room, S.location_building, Course.name"
		+ " FROM Section AS S"
		+ " JOIN Course ON S.subject = Course.subject AND S.course_number = Course.course_number"
		+ " INNER JOIN Attends AS A ON S.subject = A.subject"
		+ " AND S.course_number = A.course_number"
		+ " AND S.section = A.section"
		+ " INNER JOIN Professor AS P ON S.professor_id = P.uid"
		+ ` WHERE A.uid = ${req.query.uid};`;
		
		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				console.log(error)
				if (error.sqlState == PROCEDURE_ERROR) {
						return res.status(400).send(error.sqlMessage);
				}
				return res.sendStatus(500);
			}
			res.json(results);
		})
	})

	// Attend section
	app.route('/Section/attend/').get((req, res) => {
		const query = `INSERT INTO Attends (uid, section, subject, course_number) VALUES (${req.query.uid}, ${req.query.section}, "${req.query.subject}", "${req.query.course_number}")`
		
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

	// Un-Attend section
	app.route('/Section/unattend/').get((req, res) => {
		const query = `DELETE FROM Attends WHERE uid = ${req.query.uid} AND section=${req.query.section} AND subject="${req.query.subject}" AND course_number="${req.query.course_number}";`
		
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

	// Get sections conflicting with given course section
	app.route('/Section/conflicting/').get((req, res) => {
		const getSection = `SELECT * FROM Section WHERE section = ${req.query.section} AND subject = "${req.query.subject}" AND course_number = "${req.query.course_number}";`
		
		console.log(getSection);
		connection.query(getSection, (error, results, fields) => {
			if (error) {
				if (error.sqlState == PROCEDURE_ERROR) {
					 return res.status(400).send(error.sqlMessage);
				}
				return res.sendStatus(500);
			} else if (results.length == 0) {
				return res.status(400).send('Could not find course section');
			}

			const section = results[0];

			const query = "SELECT Course.subject AS subject, Course.course_number AS course_number, Course.name AS name,"
				+ " Section.section, Section.start_time, Section.end_time,"
				+ " Section.days, Professor.name AS professor_name, Section.type"
				+ " FROM Course"
				+ " JOIN Section ON Section.subject = Course.subject AND Section.course_number = Course.course_number"
				+ " INNER JOIN Professor ON Section.professor_id = Professor.uid"
				+ ` WHERE (Section.days &  ${section.days} > 1`
				+ ` AND Section.start_time >= "${section.start_time}"`
				+ ` AND Section.start_time <= "${section.end_time}")`
				+ " OR "
				+ `(Section.days & ${section.days} > 1`
				+ ` AND Section.end_time <= "${section.end_time}" `
				+ ` AND Section.end_time >= "${section.start_time}");`;

			console.log(query);
			connection.query(query, (error, results, fields) => {
				if (error) {
					return res.sendStatus(500);
				}
				res.json(results);
			})
		})
	})

	// Get sections for a course
	app.route('/Section/get').get((req, res) => {
		const query = "SELECT Course.subject, Course.course_number, Course.name,"
		+ " Section.section, Section.start_time, Section.end_time,"
		+ " Section.days, Professor.name AS professor_name, Section.type"
		+ " FROM Course"
		+ " JOIN Section ON Section.subject = Course.subject AND Section.course_number = Course.course_number"
		+ " INNER JOIN Professor ON Section.professor_id = Professor.uid"
		+ ` WHERE Section.subject="${req.query.subject}" AND Section.course_number="${req.query.course_number}";`
		
		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				if (error.sqlState == PROCEDURE_ERROR) {
					 return res.status(400).send(error.sqlMessage);
				}
				console.log(error)
				return res.sendStatus(500);
			}
			res.json(results);
		})
	})

}

module.exports = ScheduleRoutes;
