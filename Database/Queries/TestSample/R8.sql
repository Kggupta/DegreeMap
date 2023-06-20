-- -------------------------------------
-- R8
-- -------------------------------------
-- List course sections that occur between starttime and endtime, during the specified weekdays
SELECT Course.subject, Course.course_number, Course.name, 
		Section.section, Section.start_time, Section.end_time, 
		Section.days, Professor.name AS professor_name, Section.type
FROM Course
JOIN Section ON Section.subject = Course.subject AND Section.course_number = Course.course_number
INNER JOIN Professor ON Section.professor_id = Professor.uid
WHERE Section.days & 64 > 1
AND Section.start_time > '00:00:00'
AND Section.end_time < '17:00:00';

-- List course sections that the user is already attending
SELECT S.subject, S.course_number, S.section, S.type, P.name AS professor_name, 
		S.days, S.start_time, S.end_time, S.location_room, S.location_building
FROM Section AS S
INNER JOIN Attends AS A ON S.subject = A.subject
    AND S.course_number = A.course_number
    AND S.section = A.section
INNER JOIN Professor AS P ON S.professor_id = P.uid
WHERE A.uid = 1;
