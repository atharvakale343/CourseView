import { mkdirp } from "mkdirp";
import sqlite3 from "sqlite3";
import dotenv from "dotenv";

dotenv.config();

export const DATABASE_BASE_DIR = process.env.DATABASE_BASE_DIR || "./var/db";

mkdirp.sync(DATABASE_BASE_DIR);

export const db = new sqlite3.Database(`${DATABASE_BASE_DIR}/users.db`);

db.serialize(function () {
    db.run(
        `CREATE TABLE IF NOT EXISTS users ( \
      id INTEGER PRIMARY KEY, \
      name TEXT, \
      email TEXT UNIQUE \
    )`,
    );

    db.run(
        `CREATE TABLE IF NOT EXISTS federated_credentials ( \
      id INTEGER PRIMARY KEY, \
      user_id INTEGER NOT NULL, \
      provider TEXT NOT NULL, \
      subject TEXT NOT NULL, \
      UNIQUE (provider, subject) \
    )`,
    );
});

export default db;
