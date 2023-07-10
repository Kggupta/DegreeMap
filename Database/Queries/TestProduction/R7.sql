-- List all courses
SELECT * FROM Course LIMIT 10;

-- Search by course ID (subject + course_number)
SELECT * FROM Course
WHERE subject = 'CS' AND course_number = '348'
LIMIT 10;

SELECT * FROM Course
WHERE subject LIKE '%C%'
LIMIT 10;

-- Search by title
SELECT * FROM Course
WHERE name LIKE '%Introduction%'
LIMIT 10;

-- Search WILDCARD NOT INFRONT
SELECT * FROM Course
WHERE name LIKE '%Introduction%' OR
subject LIKE 'HR%' OR
course_number LIKE '20%' OR
description LIKE '%Introduction%'
LIMIT 10;

-- Search BOTH WILDCARDS AROUND STIRNG
SELECT * FROM Course
WHERE name LIKE '%Introduction%' OR
subject LIKE '%HR%' OR
course_number LIKE '%20%' OR
description LIKE '%Introduction%'
LIMIT 10;

-- Only show courses that have a scheduled section
SELECT DISTINCT subject, course_number, name, description FROM Course
NATURAL JOIN Section
WHERE name LIKE '%Introductio%' OR
subject LIKE 'CS%' OR
description LIKE '%Introductio%'
LIMIT 10;

SELECT DISTINCT subject, course_number, name, description FROM Course
NATURAL JOIN Section
WHERE name LIKE '%HR%' OR
subject LIKE 'HR%' OR
LIMIT 10;

-- Add course
INSERT INTO Course (subject, course_number, name, description) VALUES (
	'zzz',
	'300',
	'zzz second course',
	'description here'
);

-- Setting pre/anti-requisites (part of adding course)
INSERT INTO PreRequisites (subject, course_number, pre_requisite_subject, pre_requisite_number) VALUES 
	('zzz', '300', 'HRM', '200'),
	('zzz', '300', 'CS', '492');

-- Getting pre reqs of a course
SELECT Course.subject, Course.course_number, name, description 
	FROM PreRequisites
	JOIN Course ON Course.subject = PreRequisites.pre_requisite_subject AND 
		Course.course_number = PreRequisites.pre_requisite_number
	WHERE PreRequisites.subject = 'zzz' AND PreRequisites.course_number = '300';

-- Getting anti-reqs of a course
SELECT Course.subject, Course.course_number, name, description 
	FROM AntiRequisites
	JOIN Course ON Course.subject = AntiRequisites.anti_requisite_subject AND 
		Course.course_number = AntiRequisites.anti_requisite_number
	WHERE AntiRequisites.subject = 'CS' AND AntiRequisites.course_number = '450';

-- Delete course (cascading delete)
DELETE FROM Course WHERE subject = 'zzz' AND course_number = '300';
