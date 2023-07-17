const { Express } = require("express");
const { Connection } = require("mysql2");
const PROCEDURE_ERROR = 45000;

// Ensure email is a valid uwaterloo email syntax wise
function validateEmail(email) {
  var re = /^[a-zA-Z0-9._%+-]+@uwaterloo\.ca$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Registers all friend routes
 *
 * @param {Express} app - The express application
 * @param {Connection} connection - MySQL connection
 */
function FriendRoutes(app, connection) {
  // get all friends
  app.route("/Friends/list").get((req, res) => {
    const query = `SELECT uid, email, name, level FROM Friends JOIN User ON Friends.uid2 = User.uid WHERE uid1 = ${req.query.uid} UNION SELECT uid, email, name, level FROM Friends JOIN User ON Friends.uid1 = User.uid WHERE uid2 = ${req.query.uid};`;
    console.log(query);
    connection.query(query, (error, results, fields) => {
      if (error) {
        return res.status(500).send("Error getting friends");
      } else if (results.length == 0) {
        console.log("NO FIRNDS  FOUND");
        return res.status(400).send("No friends");
      }
      res.json(results);
    });
  });

  // add friend
  app.route("/Friends/add").get((req, res) => {
    console.log("PRINTING BODY: " + req.query.friendsEmail);
    const friendEmail = req.query.friendsEmail;
    const userEmail = req.query.userEmail;
    if (validateEmail(friendEmail) == false) {
      return res.status(400).send("Invalid email");
    }

    if (friendEmail == userEmail) {
      return res.status(400).send("You cannot add yourself as a friend");
    }

    const uidQuery = `SELECT uid FROM User WHERE email = "${friendEmail}" AND uid NOT IN (SELECT uid2 FROM Friends WHERE uid1 = ${req.query.uid});`;
    console.log(uidQuery);
    connection.query(uidQuery, (error, results, fields) => {
      if (error) {
        return res.status(500).send("Could not retrieve any firneds");
      } else if (results.length == 0) {
        return res
          .status(400)
          .send("Friend already added or No user with that email");
      }
      console.log(results);
      const uid2 = results[0].uid;
      const query = `INSERT INTO Friends (uid1, uid2) VALUES (${req.query.uid},${uid2});`;
      console.log(query);
      connection.query(query, (error, results, fields) => {
        if (error) {
          return res.status(500).send("Could not add friend");
        }
        const selectQuery = `SELECT * FROM Friends`;
        console.log(selectQuery);
        connection.query(selectQuery, (error, results, fields) => {
          if (error) {
            return res.status(500).send("Could not get friends list");
          }
          console.log(results);
        });
        res.sendStatus(200);
      });
    });
  });

  // remove friend
  app.route("/Friends/remove").get((req, res) => {
    const query = `DELETE FROM Friends WHERE (uid1 = ${req.query.uid} AND uid2 = ${req.query.friendId}) OR (uid2 = ${req.query.uid} AND uid1 = ${req.query.friendId});`;
    console.log(query);
    connection.query(query, (error, results, fields) => {
      if (error) {
        return res.status(500).send("Could not remove friend");
      }
      res.sendStatus(200);
    });
  });

  // get previously taken courses with a friend
  app.route("/Friends/prevTogether").get((req, res) => {
    const query = `SELECT DISTINCT T1.subject, T1.course_number FROM Takes AS T1 INNER JOIN Takes AS T2 ON T1.subject = T2.subject AND T1.course_number = T2.course_number WHERE T1.uid = ${req.query.uid} AND T2.uid = ${req.query.friendId};`;
    console.log(query);
    connection.query(query, (error, results, fields) => {
      if (error) {
        return res.status(500).send("Could not get courses taken together");
      } else if (results.length == 0) {
        return res.status(400).send("No courses taken together");
      }
      console.log("PREV TOGETHER RESULTS: ", results);
      res.json(results);
      // res.json(results.map(result => result.subject));
    });
  });

  app.route("/Friends/currTogether").get((req, res) => {
    const query = `SELECT S.subject, S.course_number, S.section FROM Attends AS A1
    INNER JOIN Attends AS A2 ON A1.subject = A2.subject
        AND A1.course_number = A2.course_number
        AND A1.section = A2.section
    INNER JOIN Section AS S ON A1.subject = S.subject
        AND A1.course_number = S.course_number
        AND A1.section = S.section
    WHERE A1.uid = ${req.query.uid}
        AND A2.uid = ${req.query.friendId};`
    console.log(query);
    connection.query(query, (error, results, fields) => {
        if (error) {
            return res.status(500).send("Could not get courses taken together");
        } else if (results.length == 0) {
            return res.status(400).send("No courses taken together");
        }
        console.log("CURR TOGETHER RESULTS: ", results);
        res.json(results);
        // res.json(results.map(result => result.subject));
        });
  });

  // suggested friends
  /*
  SELECT DISTINCT U.uid, U.name, U.email, T.subject, T.course_number
FROM Takes AS T
INNER JOIN User AS U ON U.uid = T.uid
WHERE (T.subject, T.course_number) IN (
    SELECT subject, course_number
    FROM Takes
    WHERE uid = 1
) AND
U.uid NOT IN (
	SELECT uid2 FROM Friends
	WHERE uid1 = 1
) AND
U.uid NOT IN (
	SELECT uid1 FROM Friends
	WHERE uid2 = 1
)
AND U.uid <> 1;

  */

  app.route("/Friends/suggested").get((req, res) => {
    // const query = `SELECT DISTINCT U.uid, U.name, U.email, T.subject, T.course_number
    // FROM Takes AS T
    // INNER JOIN User AS U ON U.uid = T.uid
    // WHERE (T.subject, T.course_number) IN (
    //     SELECT subject, course_number
    //     FROM Takes
    //     WHERE uid = ${req.query.uid}
    // ) AND
    // U.uid NOT IN (
    //     SELECT uid2 FROM Friends
    //     WHERE uid1 = ${req.query.uid}
    // ) AND
    // U.uid NOT IN (
    //     SELECT uid1 FROM Friends
    //     WHERE uid2 = ${req.query.uid}
    // )
    // AND U.uid <> ${req.query.uid};`;

    const query = `SELECT U.uid, U.name, U.email
    FROM User AS U
    WHERE U.uid IN (
        SELECT DISTINCT T.uid
        FROM Takes AS T
        WHERE (T.subject, T.course_number) IN (
            SELECT subject, course_number
            FROM Takes
            WHERE uid = ${req.query.uid}
        )
    ) AND
    U.uid NOT IN (
        SELECT uid2 FROM Friends
        WHERE uid1 = ${req.query.uid}
    ) AND
    U.uid NOT IN (
        SELECT uid1 FROM Friends
        WHERE uid2 = ${req.query.uid}
    )
    AND U.uid <> ${req.query.uid};`


    // const testQuery = `SELECT * FROM Takes`

    // console.log(testQuery);
    // connection.query(testQuery, (error, results, fields) => {
    //     if (error) {
    //         console.log("BIG PROJELEM");
    //         return res.status(500).send("Could not get suggested friends");
    //     }
    //     console.log(results);
    //     res.json(results)
    //     // res.json(results.map(result => result.subject));
    // });

    connection.query(query, (error, results, fields) => {
      if (error) {
        console.log("BIG PROJELEM");
        return res.status(500).send("Could not get suggested friends");
      }
      console.log("SUGGESTION RESULTS: ", results);
      res.json(results);
      // res.json(results.map(result => result.subject));
    });
  });
}

module.exports = FriendRoutes;
