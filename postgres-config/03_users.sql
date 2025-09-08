
\c jsmge;
SET ROLE jsmgeadm;

CREATE TABLE Users (
    uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255)
);
COMMIT;

CREATE TABLE Sessions (
    uid UUID,
    token VARCHAR(255) NOT NULL,
    expire TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES Users(uid)
);
COMMIT;

CREATE INDEX i_session_token ON Sessions(token);
COMMIT;

CREATE OR REPLACE FUNCTION delete_expired_tokens()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM Sessions WHERE expire <= NOW(); 
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Corrected trigger definition
CREATE TRIGGER clean_expired_tokens
AFTER INSERT OR UPDATE ON Sessions 
FOR EACH ROW
EXECUTE FUNCTION delete_expired_tokens();