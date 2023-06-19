
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