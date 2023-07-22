const {Express} = require("express");
const {Connection} = require("mysql2");
const PROCEDURE_ERROR = 45000;

/**
 * Registers all user routes
 * 
 * @param {Express} app - The express application
 * @param {Connection} connection - MySQL connection
 */
function CourseRoutes(app, connection) {
	// Get all course subjects
	app.route('/Course/subjects/').get((req, res) => {
		const query = `SELECT DISTINCT subject FROM Course;`
		console.log("QUERYING SUBJECTS")
		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error || results.length == 0) {
				return res.sendStatus(500);
			}
			res.json(results.map(result => result.subject));
		})
	})

	// Get all course codes given subject
	app.route('/Course/numbers/').get((req, res) => {
		const query = `SELECT DISTINCT course_number FROM Course WHERE subject=${connection.escape(req.query.subject)};`
		console.log(query);
		connection.query(query, {
			subject: `"${req.query.subject}"`
		}, (error, results, fields) => {
			if (error || results.length == 0) {
				console.log(error)
				return res.sendStatus(500);
			}
			res.json(results.map(result => result.course_number));
		})
	})

	// Add course
	app.route('/Course/insert/').get((req, res) => {
		const preReqs = req.query.prereqs.replace(/ /g, '').split(',').map(course => {
			const matched = course.toUpperCase().match(/(?<subject>[A-Z]+)(?<course_number>[0-9]+)/)
			
			return matched?.groups;
		});
		if (preReqs.includes(undefined) || preReqs.includes(null)) {
			return res.status(400).send('Invalid Pre-Requisite String')
		}

		const antiReqs = req.query.antireqs.replace(/ /g, '').split(',').map(course => {
			const matched = course.toUpperCase().match(/(?<subject>[A-Z]+)(?<course_number>[0-9]+)/)
			
			return matched?.groups;
		});
		if (preReqs.includes(undefined) || preReqs.includes(null)) {
			return res.status(400).send('Invalid Anti-Requisite String')
		}

		const CourseQuery = `SELECT subject, course_number FROM Course;`;
		connection.query(CourseQuery, (error, results, fields) => {
			if (error) {
				return res.status(400).send('Failed to get courses')
			}
			for (let i = 0; i < preReqs.length; i ++) {
				if (!results.some(course => course.subject === preReqs[i].subject && 
					course.course_number === preReqs[i].course_number)) {
					return res.status(400).send('Invalid Pre-Requisite String');
				}
			}
			for (let i = 0; i < antiReqs.length; i++) {
				if (!results.some(course => course.subject === antiReqs[i].subject && 
					course.course_number === antiReqs[i].course_number)) {
					return res.status(400).send('Invalid Anti-Requisite String');
				}
			}

			const query = `INSERT INTO Course (subject, course_number, name, description) VALUES (` +
			`${connection.escape(req.query.subject)}, ${connection.escape(req.query.course_number)}, ${connection.escape(req.query.name)}, ${connection.escape(req.query.description)});`

			console.log(query);
			connection.query(query, (error, results, fields) => {
				if (error) {
					return res.status(400).send('Course Already Exists.');
				}
				const InsertPreReq = `INSERT INTO PreRequisites (subject, course_number, pre_requisite_subject, pre_requisite_number) VALUES ` +
				preReqs.map(prereq => `(${connection.escape(req.query.subject)}, ${connection.escape(req.query.course_number)}, ${connection.escape(prereq.subject)}, ${connection.escape(prereq.course_number)})`).join(', ') + ';';
				connection.query(InsertPreReq, (error, results, fields) => {
					if (error) {
						return res.status(400).send('Failed Pre-Requisite Insertion');
					}
					const InsertAntiReq = `INSERT INTO AntiRequisites (subject, course_number, anti_requisite_subject, anti_requisite_number) VALUES ` +
					antiReqs.map(antireq => `(${connection.escape(req.query.subject)}, ${connection.escape(req.query.course_number)}, ${connection.escape(antireq.subject)}, ${connection.escape(antireq.course_number)})`).join(', ') + ';';
					connection.query(InsertAntiReq, (error, results, fields) => {
						if (error) {
							return res.status(400).send('Failed Anti-Requisite Insertion');
						}
						res.sendStatus(200);
					})
				})
			})
		})
	})

	// Add prereqs
	app.route('/Course/prereqs/insert').get((req, res) => {
		const query = `INSERT INTO PreRequisites (subject, course_number, pre_requisite_subject, pre_requisite_number) VALUES (` +
						`${connection.escape(req.query.subject)}, ${connection.escape(req.query.course_number)}, ${connection.escape(req.query.prereq_subject)}, ${connection.escape(req.query.prereq_number)});`

		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				return res.status(400).send('Pre Requisite Already Exists');
			}
			res.sendStatus(200);
		})
	})

	// Add anti reqs
	app.route('/Course/antireqs/insert').get((req, res) => {
		const query = `INSERT INTO AntiRequisites (subject, course_number, anti_requisite_subject, anti_requisite_number) VALUES (` +
						`${connection.escape(req.query.subject)}, ${connection.escape(req.query.course_number)}, ${connection.escape(req.query.antireq_subject)}, ${connection.escape(req.query.antireq_number)});`

		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				return res.status(400).send('Anti Requisite Already Exists');
			}
			res.sendStatus(200);
		})
	})


	// Delete course
	app.route('/Course/delete/').get((req, res) => {
		const query = `DELETE FROM Course WHERE subject = ${connection.escape(req.query.subject)} AND course_number = ${connection.escape(req.query.course_number)};`

		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				return res.sendStatus(400);
			}
			res.sendStatus(200);
		})
	})

	// Get course pre-reqs
	app.route('/Course/prereqs/').get((req, res) => {
		const query = `CALL GetPreReqs(${connection.escape(req.query.subject)}, ${connection.escape(req.query.course_number)});`

		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				return res.sendStatus(400);
			}
			res.json(results[0]);
		})
	})

	// Get course anti-reqs
	app.route('/Course/antireqs/').get((req, res) => {
		const query = `CALL GetAntiReqs(${connection.escape(req.query.subject)}, ${connection.escape(req.query.course_number)});`

		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				return res.sendStatus(400);
			}
			res.json(results[0]);
		})
	})

	// Search course
	app.route('/Course/search/').get((req, res) => {
		let query = '';
		if (req.query.availableOnly == "true") {
			if (req.query.subject) {
				query = `CALL SearchAvailableSubject(${connection.escape(req.query.subject)}, ${connection.escape('%' + req.query.search + '%')});`
			} else {
				query = `CALL SearchAvailable(${connection.escape('%' + req.query.search + '%')});`
			}
		} else {
			if (req.query.subject) {
				query = `CALL SearchSubject(${connection.escape(req.query.subject)}, ${connection.escape('%' + req.query.search + '%')});`
			} else {
				query = `CALL Search(${connection.escape('%' + req.query.search + '%')});`
			}
		}
		
		console.log(query);
		connection.query(query, (error, results, fields) => {
			if (error) {
				return res.sendStatus(400);
			}
			res.json(results[0]);
		})
	})
}

module.exports = CourseRoutes;