
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

CREATE PROCEDURE UpdateUserAdminPermission(
    IN target_uid INT,
    IN source_uid INT
)
BEGIN
    DECLARE source_is_admin BOOLEAN;

    -- Check if the source user is an admin
    SELECT is_admin INTO source_is_admin
    FROM User
    WHERE uid = source_uid;

    -- Throw an error if the source user is not an admin
    IF source_is_admin IS NULL OR source_is_admin = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'You do not have permission to do that.';
    ELSE
        -- Update the target user's is_admin permission to true
        UPDATE User
        SET is_admin = 1
        WHERE uid = target_uid;
    END IF;
END;

CREATE PROCEDURE InsertUser(
    IN p_email VARCHAR(50),
    IN p_name VARCHAR(50),
    IN p_password VARCHAR(25),
    IN p_level VARCHAR(2)
)
BEGIN
    DECLARE email_count INT;
    
    -- Check if email already exists
    SELECT COUNT(*) INTO email_count
    FROM User
    WHERE email = p_email;
    
    IF email_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Email already exists.';
    ELSE
        -- Insert the user
        INSERT INTO User (email, name, password, level)
        VALUES (p_email, p_name, p_password, p_level);
    END IF;
    
END;

CREATE PROCEDURE GetUserByEmailAndPassword(
    IN p_email VARCHAR(50),
    IN p_password VARCHAR(25)
)
BEGIN
    DECLARE user_count INT;
    
    -- Check if email and password are correct
    SELECT COUNT(*) INTO user_count
    FROM User
    WHERE email = p_email AND password = p_password;
    
    IF user_count = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid email or password.';
    ELSE
        -- Return user attributes
        SELECT *
        FROM User
        WHERE email = p_email AND password = p_password LIMIT 1;
    END IF;
    
END;

CREATE PROCEDURE GetUserEstimatedGrade(
    IN p_uid INT,
    IN p_subject VARCHAR(10),
    IN p_number VARCHAR(10)
)
BEGIN
    DECLARE total_content INT;

    SELECT COUNT(*) INTO total_content
    FROM GradedContent
    WHERE uid = p_uid AND subject = p_subject AND course_number = p_number;
    
    IF total_content = 0 THEN
        SELECT NULL;
    ELSE
        SELECT SUM(grade * (weight / 100)) AS grade
        FROM GradedContent
        WHERE uid = p_uid AND subject = p_subject AND course_number = p_number;
    END IF;

END;
