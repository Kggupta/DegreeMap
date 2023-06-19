
-- -------------------------------------
-- R11
-- -------------------------------------
-- List all courses that a user can take based on pre-reqs and
--   courses they have already taken
-- Then remove all courses that the user can't take because they've taken an anti-requisite
-- Then remove all courses that the user has already taken
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
    ))
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