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
SELECT DISTINCT subject, course_number, name, description FROM Course
NATURAL JOIN Section
WHERE name LIKE '%Introductio%' AND
subject LIKE '%CS%' AND
course_number LIKE '%34%' AND
description LIKE '%%';

SELECT DISTINCT subject, course_number, name, description FROM Course
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

-- Getting pre reqs of a course
SELECT Course.subject, Course.course_number, name, description 
	FROM PreRequisites
	JOIN Course ON Course.subject = PreRequisites.pre_requisite_subject AND 
		Course.course_number = PreRequisites.pre_requisite_number
	WHERE PreRequisites.subject = 'HRM' AND PreRequisites.course_number = '300';

-- Getting anti-reqs of a course
SELECT Course.subject, Course.course_number, name, description 
	FROM AntiRequisites
	JOIN Course ON Course.subject = AntiRequisites.anti_requisite_subject AND 
		Course.course_number = AntiRequisites.anti_requisite_number
	WHERE AntiRequisites.subject = 'CS' AND AntiRequisites.course_number = '348';

-- Delete course (cascading delete)
DELETE FROM Course WHERE subject = 'HRM' AND course_number = '300';
