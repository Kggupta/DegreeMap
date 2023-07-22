const {Express} = require("express");
const {Connection} = require("mysql2");
const PROCEDURE_ERROR = 45000;

/**
 * Registers all user routes
 * 
 * @param {Express} app - The express application
 * @param {Connection} connection - MySQL connection
 */
function TakeCourseRoutes(app, connection) {
	// Add Taken Course
	app.route('/TakeCourse/Taken/').get((req, res) => {
		query = ""
		if (req.query.grade != undefined) {
			query = `INSERT INTO Takes (uid,subject,course_number,grade,level) VALUES (${req.query.uid}, ${connection.escape(req.query.subject)}, ${connection.escape(req.query.course_number)}, ${req.query.grade}, "${req.query.level}")`
		} else {
			query = `INSERT INTO Takes (uid,subject,course_number,grade,level) VALUES (${req.query.uid}, ${connection.escape(req.query.subject)}, ${connection.escape(req.query.course_number)}, NULL, "${req.query.level}")`
		}
		
		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				console.log("an error happened")
				console.log(error)
				if (error.sqlState == PROCEDURE_ERROR) {
					 return res.status(400).send(error.sqlMessage);
				}
				return res.sendStatus(500);
			}
			console.log("no err")
			res.sendStatus(200);
		})
	})

    // Remove a Taken Course
	app.route('/TakeCourse/untaken/').get((req, res) => {
		const query = `DELETE FROM Takes WHERE uid = ${req.query.uid} AND subject=${connection.escape(req.query.subject)} AND course_number=${connection.escape(req.query.course_number)};`
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

	// List all Taken Courses
	app.route('/TakeCourse/grades/').get((req, res) => {
		const query = `SELECT * FROM Takes WHERE uid = ${req.query.uid} ORDER BY level ASC;`
		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				return res.status(400).send("Could not add Course");
			}
			res.json(results);

		})
	})

	// Update a taken course grades
	app.route('/TakeCourse/update').get((req, res) => {
		const uid = req.query.uid;
		const body = req.query;
		if (!body) return res.sendStatus(400);
		const subject = connection.escape(body.subject);
		const course_number = connection.escape(body.course_number);
		const grade = body.grade;

		if (!grade || !subject || !course_number) {
			return res.sendStatus(400).send('Invalid body.');
		}

		var query = `UPDATE Takes SET `;
		query += `grade = ${grade} `
		query += `WHERE uid = ${uid} AND course_number = ${course_number} AND subject = ${subject};`
		
		console.log(query);
		connection.query(query, (error, results) => {
			if (error) {
				console.log(error)
				return res.status(400).send("Could not update grade value.");
			}
			res.sendStatus(200);
		})
	})

	// Get User's Rank
	app.route('/TakeCourse/rank/').get((req, res) => {
		const query = `WITH AllRanks AS (SELECT U.uid, U.name, U.email, AVG(T.grade) AS average_gpa, RANK() OVER (ORDER BY AVG(T.grade) DESC) AS 'rank' FROM User AS U JOIN Takes AS T ON U.uid = T.uid WHERE T.grade IS NOT NULL GROUP BY U.uid ORDER BY average_gpa DESC) SELECT * FROM AllRanks WHERE uid = ${req.query.uid}`
		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				return res.status(400).send("Could not get User's Rank");
			}
			res.json(results);
		})
	})

	//Get a User's GPA %
	app.route('/TakeCourse/percent_gpa/').get((req, res) => {
		const query = `SELECT AVG(T.grade) AS average_gpa FROM Takes AS T WHERE T.uid = ${req.query.uid} AND T.grade IS NOT NULL;`
		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				return res.status(400).send("Could not get Percent GPA");
			}
			res.json(results);
		})
	})

	//Get a User's GPA (4.0)
	app.route('/TakeCourse/four_point_gpa/').get((req, res) => {
		const query = `	SELECT (SUM(CASE WHEN T.grade >= 90 THEN 4.0 WHEN T.grade >= 80 THEN 3.7 WHEN T.grade >= 70 THEN 3.3 WHEN T.grade >= 60 THEN 3.0 WHEN T.grade >= 50 THEN 2.7 ELSE 0.0 END) / COUNT(*)) AS four_point_gpa FROM Takes AS T WHERE T.uid = ${req.query.uid} AND T.grade IS NOT NULL;`
		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				return res.status(400).send("Could not get Four Point GPA");
			}
			res.json(results);
		})
	})
}

module.exports = TakeCourseRoutes;