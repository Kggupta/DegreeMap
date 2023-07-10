-- Create the database tables
CREATE TABLE IF NOT EXISTS User (
	uid INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	email VARCHAR(50) NOT NULL,
	name VARCHAR(50) NOT NULL,
	password VARCHAR(25) NOT NULL,
	level VARCHAR(2) NOT NULL,
	is_admin BOOLEAN NOT NULL DEFAULT 0,
	UNIQUE (email),
	CONSTRAINT email_chk CHECK (email LIKE '%@uwaterloo.ca'),
	CONSTRAINT name_chk CHECK (length(name) >= 1),
	CONSTRAINT password_chk CHECK (length(password) >= 8)
);

CREATE TABLE IF NOT EXISTS Course (
	subject VARCHAR(10) NOT NULL,
	course_number VARCHAR(10) NOT NULL,
	name VARCHAR(100) NOT NULL,
	description VARCHAR(10000) NOT NULL,
	PRIMARY KEY (subject, course_number)
);

CREATE TABLE IF NOT EXISTS Professor (
	uid VARCHAR(100) NOT NULL PRIMARY KEY,
	name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS PercentageCourse (
	subject VARCHAR(10) NOT NULL,
	course_number VARCHAR(10) NOT NULL,
	FOREIGN KEY (subject, course_number) REFERENCES Course(subject, course_number)
		ON DELETE CASCADE,
	PRIMARY KEY (subject, course_number)
);

CREATE TABLE IF NOT EXISTS PreRequisites (
	subject VARCHAR(10) NOT NULL,
	course_number VARCHAR(10) NOT NULL,
	pre_requisite_subject VARCHAR(10) NOT NULL,
	pre_requisite_number VARCHAR(10) NOT NULL,
	PRIMARY KEY (subject, course_number, pre_requisite_subject, pre_requisite_number),
	FOREIGN KEY (subject, course_number) REFERENCES Course(subject, course_number)
		ON DELETE CASCADE,
	FOREIGN KEY (pre_requisite_subject, pre_requisite_number) REFERENCES Course(subject, course_number)
		ON DELETE CASCADE,
	CONSTRAINT nocycles_chk CHECK (
		(subject = pre_requisite_subject AND course_number = pre_requisite_number) IS FALSE
	)
);

CREATE TABLE IF NOT EXISTS AntiRequisites (
	subject VARCHAR(10) NOT NULL,
	course_number VARCHAR(10) NOT NULL,
	anti_requisite_subject VARCHAR(10) NOT NULL,
	anti_requisite_number VARCHAR(10) NOT NULL,
	PRIMARY KEY (subject, course_number, anti_requisite_subject, anti_requisite_number),
	FOREIGN KEY (subject, course_number) REFERENCES Course(subject, course_number),
	FOREIGN KEY (anti_requisite_subject, anti_requisite_number) REFERENCES Course(subject, course_number),
	CONSTRAINT noanticycles_chk CHECK (
		(subject = anti_requisite_subject AND course_number = anti_requisite_number) IS FALSE
	)
);

CREATE TABLE IF NOT EXISTS Section (
	section INT NOT NULL,
	subject VARCHAR(10) NOT NULL,
	course_number VARCHAR(10) NOT NULL,
	type VARCHAR(3) NOT NULL,
	professor_id VARCHAR(100),
	days INT DEFAULT 127,
	start_time TIME NOT NULL,
	end_time TIME NOT NULL,
	location_room VARCHAR(10),
	location_building VARCHAR(10),
	FOREIGN KEY (professor_id) REFERENCES Professor(uid) ON DELETE CASCADE,
	PRIMARY KEY (section, subject, course_number),
	FOREIGN KEY (subject, course_number) REFERENCES Course(subject, course_number) ON DELETE CASCADE,
	CONSTRAINT end_after_start_chk CHECK (
		start_time <= end_time
	)
);

CREATE TABLE IF NOT EXISTS Takes (
	uid INT NOT NULL,
	subject VARCHAR(10) NOT NULL,
	course_number VARCHAR(10) NOT NULL,
	grade DECIMAL(5, 2),
	level VARCHAR(2),
	FOREIGN KEY (uid) REFERENCES User(uid) ON DELETE CASCADE,
	FOREIGN KEY (subject, course_number) REFERENCES Course(subject, course_number) ON DELETE CASCADE,
	PRIMARY KEY (uid, subject, course_number),
	CONSTRAINT grade_chk CHECK (
		grade IS NULL OR (grade >= 0.0 AND grade <= 100.0)
	)
);

CREATE TABLE IF NOT EXISTS Attends (
	uid INT NOT NULL,
	section INT NOT NULL,
	subject VARCHAR(10) NOT NULL,
	course_number VARCHAR(10) NOT NULL,
	FOREIGN KEY (uid) REFERENCES User(uid) ON DELETE CASCADE,
	FOREIGN KEY (section, subject, course_number) REFERENCES Section(section, subject, course_number)
		ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY (uid, section, subject, course_number)
);

CREATE TABLE IF NOT EXISTS Friends (
	uid1 INT NOT NULL,
	uid2 INT NOT NULL,
	PRIMARY KEY (uid1, uid2),
	FOREIGN KEY (uid1) REFERENCES User(uid) ON DELETE CASCADE,
	FOREIGN KEY (uid2) REFERENCES User(uid) ON DELETE CASCADE,
	CONSTRAINT friends_with_self_chk CHECK (
		uid1 != uid2
	)
);

CREATE TABLE IF NOT EXISTS Deadlines (
	uid INT NOT NULL,
	subject VARCHAR(10) NOT NULL,
	course_number VARCHAR(10) NOT NULL,
	name VARCHAR(20) NOT NULL,
	due_date DATETIME NOT NULL,
	FOREIGN KEY (uid) REFERENCES User(uid) ON DELETE CASCADE,
	FOREIGN KEY (subject, course_number) REFERENCES Course(subject, course_number)
		ON DELETE CASCADE,
	PRIMARY KEY (uid, subject, course_number, name)
);

CREATE TABLE IF NOT EXISTS GradedContent (
	uid INT NOT NULL,
	subject VARCHAR(10) NOT NULL,
	course_number VARCHAR(10) NOT NULL,
	name VARCHAR(20) NOT NULL,
	grade INT NOT NULL,
	weight DECIMAL(5, 2) NOT NULL,
	FOREIGN KEY (uid) REFERENCES User(uid) ON DELETE CASCADE,
	FOREIGN KEY (subject, course_number) REFERENCES PercentageCourse(subject, course_number)
		ON DELETE CASCADE,
	PRIMARY KEY (uid, subject, course_number, name),
	CONSTRAINT grade_geq_zero_chk CHECK (
		grade >= 0 -- grades must be non negative, but bonus marks can allow them to be > 100
	),
	CONSTRAINT weight_geq_zero_chk CHECK (
		weight >= 0 -- weights must be non negative
	)
);

CREATE VIEW CreditReceivedCourses AS
SELECT C.subject, C.course_number, C.name, C.description
FROM Course AS C
LEFT JOIN PercentageCourse AS PC ON C.subject = PC.subject AND C.course_number = PC.course_number
WHERE PC.subject IS NULL;
