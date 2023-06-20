-- General Notes:
--   > Some queries have a simple SELECT * FROM User/etc... ....
--         This is just to show in the output file what the change looks like in the database.
--   > These queries all use dummy data such as 'test@uwaterloo.ca'
--         These queries will all use actual data that will be inserted by the server in practice.
-- R6
-- -------------------------------------
-- Register user
-- Registering user if they already exist will throw error
CALL InsertUser('test@uwaterloo.ca', 'Test', 'passpass', '1A');
CALL InsertUser('test@uwaterloo.ca', 'duplication', 'asdfasdf', '1B');

SELECT * FROM User WHERE email = 'test@uwaterloo.ca';

-- Login User with correct password
CALL GetUserByEmailAndPassword('test@uwaterloo.ca', 'passpass');

-- Login User with incorrect password
CALL GetUserByEmailAndPassword('test@uwaterloo.ca', 'password');

-- Login User incorrect email
CALL GetUserByEmailAndPassword('tes@uwaterloo.ca', 'passpass');

-- Login User no account
CALL GetUserByEmailAndPassword('tes@uwaterloo.ca', 'passpass');


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