-- General Notes:
--   > Some queries have a simple SELECT * FROM User/etc... ....
--         This is just to show in the output file what the change looks like in the database.
--   > These queries all use dummy data such as 'test@uwaterloo.ca'
--         These queries will all use actual data that will be inserted by the server in practice.
-- R6
-- -------------------------------------
-- Register user
-- Registering user if they already exist will do nothing
INSERT INTO User (email, name, password, level)
SELECT 'test@uwaterloo.ca', 'Test', 'passpass', '1A'
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1
    FROM User
    WHERE email = 'test@uwaterloo.ca'
);

SELECT * FROM User WHERE email = 'test@uwaterloo.ca';

-- Login User with correct password
SELECT * 
FROM User
WHERE email = 'test@uwaterloo.ca' AND
password = 'passpass' LIMIT 1;

-- Login User with incorrect password
SELECT *
FROM User
WHERE email = 'test@uwaterloo.ca' AND
password = 'password' LIMIT 1;

-- Login User incorrect email
SELECT *
FROM User
WHERE email = 'tes@uwaterloo.ca' AND
password = 'passpass' LIMIT 1;

-- Login User no account
SELECT *
FROM User
WHERE email = 'tes@uwaterloo.ca' AND
password = 'passpass' LIMIT 1;

-- Update administrator level
-- See Procedures.sql for the procedure code
CALL UpdateUserAdminPermission(1, 6);
CALL UpdateUserAdminPermission(6, 1);

SELECT * FROM User WHERE uid = 6;

-- Revert for other tests
UPDATE User
SET is_admin = 0
WHERE uid = 6;

-- Update Academic Level
UPDATE User
SET level = '4B'
WHERE uid = 6;

SELECT * FROM User WHERE uid = 6;

-- Check user administrator
SELECT is_admin
FROM User
WHERE uid = 1;

SELECT is_admin FROM User
WHERE uid = 6;

-- Delete user
DELETE FROM User
WHERE uid = 6;

-- Cleanup

INSERT INTO User (uid, email, name, password, level) VALUES (
	6,
	'dummy@uwaterloo.ca',
	'Dummy User',
	'password1',
	'1A'
);

DELETE FROM User 
WHERE email = 'test@uwaterloo.ca';