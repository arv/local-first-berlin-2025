CREATE TABLE IF NOT EXISTS"user" (
    "id" VARCHAR PRIMARY KEY,
    "login" VARCHAR NOT NULL,
    "name" VARCHAR,
    "avatar" VARCHAR,
    "githubID" INTEGER NOT NULL
);

CREATE UNIQUE INDEX user_login_idx ON "user" (login);
CREATE UNIQUE INDEX user_githubid_idx ON "user" ("githubID");