import PouchDB from "pouchdb";
import PouchFind from "pouchdb-find";
import { mkdirp } from "mkdirp";
import dotenv from "dotenv";
import path from "path";
import { DATABASE_BASE_DIR } from "./tables";
import { logger } from "../utils/logger";
import { hydrateTestAccount } from "../utils/hydrateTestAccount";

dotenv.config();

const pouchDbPath = path.resolve(DATABASE_BASE_DIR, "PouchDB");
logger.info(`PouchDB path: ${pouchDbPath}`);

mkdirp.sync(pouchDbPath);

PouchDB.plugin(PouchFind);
// Create a new database instance
export const courseDB = new PouchDB(path.resolve(pouchDbPath, "courseDB"));
export const userDB = new PouchDB(path.resolve(pouchDbPath, "userDB"));
export const assignmentDB = new PouchDB(
    path.resolve(pouchDbPath, "assignmentDB"),
);

// Hydrate the test account with some data
hydrateTestAccount();
