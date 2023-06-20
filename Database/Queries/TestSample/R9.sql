-- -------------------------------------
-- R9
-- -------------------------------------
-- Show all friends
SELECT uid, email, name, level
FROM Friends
JOIN User ON Friends.uid2 = User.uid
WHERE uid1 = 1;

-- Get mutual courses that two given users (1, 2 in this case) have taken
SELECT DISTINCT T1.subject, T1.course_number
FROM Takes AS T1
INNER JOIN Takes AS T2 ON T1.subject = T2.subject
    AND T1.course_number = T2.course_number
WHERE T1.uid = 1
    AND T2.uid = 3;

-- Get course sections that two given users (1, 2 in this case) are attending at the same time
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