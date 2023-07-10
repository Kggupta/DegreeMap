DROP INDEX idx_deadlines_due_date ON Deadlines;

-- Get all due dates that are in the past
SELECT email, subject, course_number, Deadlines.name AS deadline_name, User.name AS user_name, due_date 
FROM Deadlines
JOIN User ON Deadlines.uid = User.uid
WHERE due_date < NOW();

CREATE INDEX idx_deadlines_due_date ON Deadlines (due_date);

SELECT email, subject, course_number, Deadlines.name AS deadline_name, User.name AS user_name, due_date 
FROM Deadlines
JOIN User ON Deadlines.uid = User.uid
WHERE due_date < NOW();
