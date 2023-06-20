-- AntiRequisites triggers
-- If there is the same pre-req in PreRequisites, delete
--  the conflicting one from pre-req
CREATE TRIGGER verify_no_conflict_anti_req AFTER INSERT
ON AntiRequisites FOR EACH ROW
BEGIN
	DELETE FROM PreRequisites
	WHERE PreRequisites.subject = NEW.subject AND 
		PreRequisites.course_number = NEW.course_number AND 
		PreRequisites.pre_requisite_subject = NEW.anti_requisite_subject AND
		PreRequisites.pre_requisite_number = NEW.anti_requisite_number;
END;

-- Attends triggers
CREATE TRIGGER verify_max_fifteen_attending BEFORE INSERT
ON Attends FOR EACH ROW
BEGIN
	IF (SELECT COUNT(*) + 1 
		FROM Attends 
		WHERE Attends.uid = NEW.uid) > 15 THEN
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'Cannot attend more course section. Maximum 15 sections.';
	END IF;
END;

-- Course triggers

-- Deadlines triggers
-- Throw error if the given due date is in the past or its too far
--  in the future
CREATE TRIGGER verify_deadline_is_future BEFORE INSERT
ON Deadlines FOR EACH ROW
BEGIN
	IF NEW.due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 4 MONTH) IS FALSE THEN
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'Invalid Due Date provided.';
	END IF;
END;

-- Friends triggers
-- Throw error if the user is already friends with the given user
CREATE TRIGGER verify_isnt_already_friend BEFORE INSERT
ON Friends FOR EACH ROW
BEGIN
	IF EXISTS (SELECT 1 FROM Friends WHERE Friends.uid1 = NEW.uid2 AND Friends.uid2 = NEW.uid1) THEN
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'You are already friends with this user.';
	END IF;
END;

-- Graded Content triggers
-- Throw error if the weights add up to more than 100 for the course
CREATE TRIGGER verify_course_weights_within_hundred BEFORE INSERT
ON GradedContent FOR EACH ROW
BEGIN
	IF (SELECT SUM(GradedContent.weight) + NEW.weight 
		FROM GradedContent 
		WHERE GradedContent.uid = NEW.uid AND 
		GradedContent.subject = NEW.subject AND 
		GradedContent.course_number = NEW.course_number) > 100 THEN
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'Invalid course weights, greater than 100%.';
	END IF;
END;

-- PercentageCourse triggers

-- PreRequisites triggers
-- If there is the same anti-req in AntiRequisites, delete
--  the conflicting one from anti-req
CREATE TRIGGER verify_no_conflict_pre_req AFTER INSERT
ON PreRequisites FOR EACH ROW
BEGIN
	DELETE FROM AntiRequisites
	WHERE AntiRequisites.subject = NEW.subject AND 
		AntiRequisites.course_number = NEW.course_number AND 
		AntiRequisites.anti_requisite_subject = NEW.pre_requisite_subject AND
		AntiRequisites.anti_requisite_number = NEW.pre_requisite_number;
END;

-- Professor triggers

-- Schedule triggers

-- Section triggers

-- Takes triggers
-- Trigger to set grade as null if the course is not on percentage grading basis
CREATE TRIGGER verify_grade_null_for_cr_courses BEFORE INSERT
ON Takes FOR EACH ROW
BEGIN
	-- MySQL does not support updating the same table that
	-- the trigger is acting on, so we have to use an IF.
	IF NOT EXISTS (
		SELECT 1 
		FROM PercentageCourse 
		WHERE subject = NEW.subject AND 
			course_number = NEW.course_number
		) THEN
		SET NEW.grade = NULL;
	END IF;
END;

-- User triggers
CREATE TRIGGER CheckUserLevel
BEFORE INSERT ON User
FOR EACH ROW
BEGIN
    IF NEW.level REGEXP '^[1-4][AB]$' IS FALSE THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid user level. Level must be one of 1A, 1B, ... 4A, 4B.';
    END IF;
END;
