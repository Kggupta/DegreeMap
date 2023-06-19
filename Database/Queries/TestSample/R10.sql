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
