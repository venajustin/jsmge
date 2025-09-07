
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
    expire TIME,
    FOREIGN KEY (uid) REFERENCES Users(uid)
);
COMMIT;

CREATE INDEX i_session_token ON Sessions(token);
COMMIT;