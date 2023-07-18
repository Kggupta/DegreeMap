const {Express} = require("express");
const {Connection} = require("mysql2");
const PROCEDURE_ERROR = 45000;
/**
 * Registers all prerequisite routes
 * 
 * @param {Express} app - The express application
 * @param {Connection} connection - MySQL connection
 */
function PreReqRoutes(app, connection) {
	app.route('/PreReqs/graph/').get((req, res) => {
		const query = "WITH RECURSIVE cte_prerequisites AS ( "
			+ "SELECT * "
			+ "FROM PreRequisites "
			+ `WHERE subject = '${req.query.subject}' AND course_number = '${req.query.number}' `
			+ "UNION ALL "
			
			+ "SELECT P.subject, P.course_number, P.pre_requisite_subject, P.pre_requisite_number "
			+ "FROM PreRequisites AS P "
			+ "INNER JOIN cte_prerequisites AS C "
			+ "ON P.subject = C.pre_requisite_subject AND P.course_number = C.pre_requisite_number "
		+ ") "
		+ "SELECT * "
		+ "FROM cte_prerequisites;"
		
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
}


module.exports = PreReqRoutes;
