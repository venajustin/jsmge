
\c jsmge;
SET ROLE jsmgeadm;

CREATE TABLE Games (
    id INTEGER UNIQUE NOT NULL DEFAULT floor(random() * (2000000000 - 1 + 1) + 1)::int,
    title VARCHAR(255),
    description VARCHAR(1000)
);

CREATE TABLE Owns(
    uid UUID,
    gameID INTEGER,
    FOREIGN KEY (uid) REFERENCES Users(uid),
    FOREIGN KEY (gameID) REFERENCES Games(id)
);
COMMIT;

