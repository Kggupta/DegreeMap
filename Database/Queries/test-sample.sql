-- General Notes:
--   > Some queries have a simple SELECT * FROM User/etc... ....
--         This is just to show in the output file what the change looks like in the database.
--   > These queries all use dummy data such as 'test@uwaterloo.ca'
--         These queries will all use actual data that will be inserted by the server in practice.
-- R6
-- -------------------------------------
-- Register user
-- Registering user if they already exist will do nothing
INSERT INTO User (email, name, password, level)
SELECT 'test@uwaterloo.ca', 'Test', 'passpass', '1A'
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1
    FROM User
    WHERE email = 'test@uwaterloo.ca'
);

SELECT * FROM User WHERE email = 'test@uwaterloo.ca';

-- Login User with correct password
SELECT * 
FROM User
WHERE email = 'test@uwaterloo.ca' AND
password = 'passpass' LIMIT 1;

-- Login User with incorrect password
SELECT *
FROM User
WHERE email = 'test@uwaterloo.ca' AND
password = 'password' LIMIT 1;

-- Login User incorrect email
SELECT *
FROM User
WHERE email = 'tes@uwaterloo.ca' AND
password = 'passpass' LIMIT 1;

-- Login User no account
SELECT *
FROM User
WHERE email = 'tes@uwaterloo.ca' AND
password = 'passpass' LIMIT 1;

-- Update administrator level
-- Ensuring the user has admin permissions to do this would be a separate query
UPDATE User
SET is_admin = 1
WHERE uid = 6;

SELECT * FROM User WHERE uid = 6;

-- Update Academic Level
UPDATE User
SET level = '4B'
WHERE uid = 6;

SELECT * FROM User WHERE uid = 6;

-- Check user administrator
SELECT is_admin
FROM User
WHERE uid = 1;

SELECT is_admin FROM User
WHERE uid = 7;

-- Delete user
DELETE FROM User
WHERE uid = 6;

DELETE FROM User 
WHERE email = 'test@uwaterloo.ca';

-- -------------------------------------
-- R7
-- -------------------------------------
-- List all courses
SELECT * FROM Course;
-- Search by course ID (subject + course_number)
SELECT * FROM Course
WHERE subject = 'CS' AND course_number = '348';

SELECT * FROM Course
WHERE subject LIKE '%C%';

-- Search by title
SELECT * FROM Course
WHERE name LIKE '%Introduction%';

-- Search by everything
SELECT * FROM Course
WHERE name LIKE '%Introduction%' AND
subject LIKE '%HRM%' AND
course_number LIKE '%20%' AND
description LIKE '%%';

-- Only show courses that have a scheduled section
SELECT subject, course_number, name, description FROM Course
NATURAL JOIN Section
WHERE name LIKE '%Introductio%' AND
subject LIKE '%CS%' AND
course_number LIKE '%34%' AND
description LIKE '%%';

SELECT subject, course_number, name, description FROM Course
NATURAL JOIN Section
WHERE name LIKE '%Introductio%' AND
subject LIKE '%HRM%' AND
course_number LIKE '%200%' AND
description LIKE '%%';

-- Add course
INSERT INTO Course (subject, course_number, name, description) VALUES (
	'HRM',
	'300',
	'HRM second course',
	'description here'
);

-- Setting pre/anti-requisites (part of adding course)
INSERT INTO PreRequisites (subject, course_number, pre_requisite_subject, pre_requisite_number) VALUES 
	('HRM', '300', 'HRM', '200'),
	('HRM', '300', 'CS', '492');

-- Getting pre/anti reqs of a course
SELECT Course.subject, Course.course_number, name, description 
	FROM PreRequisites
	JOIN Course ON Course.subject = PreRequisites.pre_requisite_subject AND 
		Course.course_number = PreRequisites.pre_requisite_number
	WHERE PreRequisites.subject = 'HRM' AND PreRequisites.course_number = '300';

SELECT Course.subject, Course.course_number, name, description 
	FROM AntiRequisites
	JOIN Course ON Course.subject = AntiRequisites.anti_requisite_subject AND 
		Course.course_number = AntiRequisites.anti_requisite_number
	WHERE AntiRequisites.subject = 'CS' AND AntiRequisites.course_number = '348';

-- Delete course (cascading delete)
DELETE FROM Course WHERE subject = 'HRM' AND course_number = '300';

SELECT * FROM Course;
SELECT * FROM PreRequisites;

-- -------------------------------------
-- R8
-- -------------------------------------
-- List course sections that occur between starttime and endtime, during the specified weekdays
SELECT Course.subject, Course.course_number, Course.name, Section.section, Professor.name AS professor_name, Section.type
FROM Course
JOIN Section ON Section.subject = Course.subject AND Section.course_number = Course.course_number
INNER JOIN Professor ON Section.professor_id = Professor.uid
WHERE Section.days & 64 > 1
AND Section.start_time > '00:00:00'
AND Section.end_time < '17:00:00';

-- List course sections that the user is already attending
SELECT S.subject, S.course_number, S.section, S.type, P.name AS professor_name, S.days, S.start_time, S.end_time, S.location_room, S.location_building
FROM Section AS S
INNER JOIN Attends AS A ON S.subject = A.subject
    AND S.course_number = A.course_number
    AND S.section = A.section
INNER JOIN Professor AS P ON S.professor_id = P.uid
WHERE A.uid = 1;

-- -------------------------------------
-- R9
-- -------------------------------------
-- Show all friends
SELECT uid, email, name, level
FROM Friends
JOIN User ON Friends.uid2 = User.uid
WHERE uid1 = 1;

-- Get mutual courses that you and another user have taken
SELECT DISTINCT T1.subject, T1.course_number
FROM Takes AS T1
INNER JOIN Takes AS T2 ON T1.subject = T2.subject
    AND T1.course_number = T2.course_number
WHERE T1.uid = 1
        AND T2.uid = 2;

-- Get course sections that two given users are attending at the same time
SELECT S.subject, S.course_number, S.section
FROM Attends AS A1
INNER JOIN Attends AS A2 ON A1.subject = A2.subject
    AND A1.course_number = A2.course_number
    AND A1.section = A2.section
INNER JOIN Section AS S ON A1.subject = S.subject
    AND A1.course_number = S.course_number
    AND A1.section = S.section
WHERE A1.uid = 1
    AND A2.uid = 2;

-- Add friend
INSERT INTO Friends (uid1, uid2) VALUES (1,4);
SELECT * FROM Friends;

-- Remove friend
DELETE FROM Friends WHERE (uid1 = 1 AND uid2 = 4) OR (uid1 = 4 AND uid2 = 1);
SELECT * FROM Friends;

-- Suggest users that are taking the same course as you
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

-- Suggest users that are taking the same course section as you
-- Example is using uid = 1 as the user
SELECT U.uid, U.name, U.email, S.subject, S.course_number, S.section
FROM User AS U
INNER JOIN Attends AS A ON U.uid = A.uid
INNER JOIN Section AS S ON A.subject = S.subject
    AND A.course_number = S.course_number
    AND A.section = S.section
WHERE U.uid <> 1
    AND U.uid NOT IN (
        SELECT uid2
        FROM Friends
        WHERE uid1 = 1
    )
    AND U.uid NOT IN (
        SELECT uid1
        FROM Friends
        WHERE uid2 = 1
    )
    AND (A.subject, A.course_number, A.section) IN (
        SELECT subject, course_number, section
        FROM Attends
        WHERE uid = 1
    );

-- -------------------------------------
-- R10
-- -------------------------------------
-- Add a % grading basis course to the taken table for the user
INSERT INTO Takes (uid,subject,course_number,grade,level) VALUES (1, "CS", "492", 90,"3B");

-- Add a credit received grading basis course to the taken table for the user
INSERT INTO Takes (uid,subject, course_number, grade, level) VALUES (1, "HRM", "200", NULL, "3B");

-- Calculate cGPA (%) given user
SELECT AVG(T.grade) AS average_gpa
FROM Takes AS T
WHERE T.uid = 2
    AND T.grade IS NOT NULL;

-- Calculate GPA (4.0 scale) given user
SELECT (SUM(CASE
        WHEN T.grade >= 90 THEN 4.0
        WHEN T.grade >= 80 THEN 3.7
        WHEN T.grade >= 70 THEN 3.3
        WHEN T.grade >= 60 THEN 3.0
        WHEN T.grade >= 50 THEN 2.7
        ELSE 0.0
    END) / COUNT(*)) AS four_point_gpa
FROM Takes AS T
WHERE T.uid = 2
    AND T.grade IS NOT NULL;

-- Get all user GPAs for the ranking aspect
WITH AllRanks AS (SELECT
    U.uid,
    U.name,
    U.email,
    AVG(T.grade) AS average_gpa,
    RANK() OVER (ORDER BY AVG(T.grade) DESC) AS 'rank'
FROM
    User AS U
JOIN
    Takes AS T ON U.uid = T.uid
WHERE
    T.grade IS NOT NULL
GROUP BY
    U.uid
ORDER BY
    average_gpa DESC)
SELECT * FROM AllRanks 
WHERE
    uid = 2;

-- Delete a taken course
DELETE FROM Takes WHERE uid = 1 AND subject = "CS" AND course_number = "492";
DELETE FROM Takes WHERE uid = 1 AND subject = "HRM" AND course_number = "200";

-- -------------------------------------
-- R11
-- -------------------------------------
-- List all courses that a user can take based on pre-reqs and
--   courses they have already taken
-- Then remove all courses that the user can't take because they've taken an anti-requisite
-- THen remove all courses that the user has already taken
(SELECT DISTINCT C.subject, C.course_number, C.name, C.description
FROM Course AS C
LEFT JOIN PreRequisites AS P ON C.subject = P.subject AND C.course_number = P.course_number
LEFT JOIN Takes AS T ON C.subject = T.subject AND C.course_number = T.course_number
WHERE
    P.pre_requisite_subject IS NULL
    OR EXISTS (
        SELECT 1
        FROM Takes AS T2
        WHERE T2.uid = 1
            AND T2.subject = P.pre_requisite_subject
            AND T2.course_number = P.pre_requisite_number
    )
    OR T.uid = 1)
EXCEPT(
SELECT DISTINCT C.subject, C.course_number, C.name, C.description
FROM Course AS C
JOIN AntiRequisites AS A ON C.subject = A.subject AND C.course_number = A.course_number
JOIN Takes AS T ON A.anti_requisite_subject = T.subject AND A.anti_requisite_number = T.course_number
WHERE
    T.uid = 1)
EXCEPT (
    SELECT DISTINCT Course.subject, Course.course_number, Course.name, Course.description
    FROM Takes
    JOIN Course ON Takes.subject = Course.subject AND Takes.course_number = Course.course_number
    WHERE Takes.uid = 1
);

-- -------------------------------------
-- R12
-- -------------------------------------
-- Recursive query to list all pre-requisites of a given course down
--  to the lowest level (which would be a course with no pre-requisites)

-- -------------------------------------
-- R13
-- -------------------------------------
-- Get 5 course subjects + numbers that a user has taken
-- NOTE: The 'Fancy' part of this feature is in the AI Model, not the 
--       SQL in this case

-- -------------------------------------
-- R14
-- -------------------------------------
-- Add graded content

-- Remove graded content

-- Calculate estimated grade for a course based on graded content values for a user

-- -------------------------------------
-- R15
-- -------------------------------------
-- NOTE: SQL Queries doesn't really apply for SQL Injection/password hashing
--       Since this logic would happen on the client + server side rather than within the database


-- -------------------------------------
-- R16
-- -------------------------------------
-- NOTE: The 'Fancy' part of this feature is in the logic for sending emails that
--       is handled by the server.
-- Get all deadlines that have passed

-- Get all deadlines that have not passed yet

-- Add deadline

-- Remove deadline