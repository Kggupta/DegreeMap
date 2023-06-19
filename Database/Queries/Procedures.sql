
CREATE PROCEDURE checkadmin(IN uid INT, OUT haspermission BOOLEAN)
BEGIN
    SELECT is_admin INTO haspermission FROM User WHERE User.uid = uid;
END;

CREATE PROCEDURE does_user_exist_uid(IN uid INT, OUT exist BOOLEAN)
BEGIN
    SELECT COUNT(*) > 0 INTO exist
    FROM User
    WHERE User.uid = uid;
END;

CREATE PROCEDURE does_user_exist_email(IN email VARCHAR(50), OUT exist BOOLEAN)
BEGIN
    SELECT COUNT(*) > 0 INTO exist
    FROM User
    WHERE User.email = email;
END;
