const { Express } = require("express");
const { Connection } = require("mysql2");
const PROCEDURE_ERROR = 45000;
/**
 * Registers all schedule routes
 * 
 * @param {Express} app - The express application
 * @param {Connection} connection - MySQL connection
 */

function PlanRoutes(app, connection) {
    // Get all courses where the user can take based on pre-requisites and anti-requisites
    app.route('/Plan/eligible-courses/').get((req, res) => {
        const query = "(SELECT DISTINCT C.subject, C.course_number, C.name, C.description"
            + " FROM Course AS C"
            + " LEFT JOIN PreRequisites AS P ON C.subject = P.subject AND C.course_number = P.course_number"
            + " LEFT JOIN Takes AS T ON C.subject = T.subject AND C.course_number = T.course_number"
            + " WHERE P.pre_requisite_subject IS NULL"
            + " OR EXISTS (SELECT 1 FROM Takes AS T2"
            + ` WHERE T2.uid = ${req.query.uid}`
            + " AND T2.subject = P.pre_requisite_subject"
            + " AND T2.course_number = P.pre_requisite_number))"
            + " EXCEPT(SELECT DISTINCT C.subject, C.course_number, C.name, C.description"
            + " FROM Course AS C"
            + " JOIN AntiRequisites AS A ON C.subject = A.subject AND C.course_number = A.course_number"
            + " JOIN Takes AS T ON A.anti_requisite_subject = T.subject AND A.anti_requisite_number = T.course_number"
            + ` WHERE T.uid = ${req.query.uid})`
            + " EXCEPT (SELECT DISTINCT Course.subject, Course.course_number, Course.name, Course.description"
            + " FROM Takes"
            + " JOIN Course ON Takes.subject = Course.subject AND Takes.course_number = Course.course_number"
            + ` WHERE Takes.uid = ${req.query.uid})`

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
}

module.exports = PlanRoutes;