-- Adding graded content
INSERT INTO GradedContent (uid, subject, course_number, name, grade, weight) VALUES (
	1, "CS", "492", "A2", 90, 10
);

-- Deleting from graded content
DELETE FROM GradedContent WHERE 
	uid = 1 AND subject = "CS" AND course_number = "492" AND name = "A2";

CALL GetUserEstimatedGrade(1, "CS", "348");
