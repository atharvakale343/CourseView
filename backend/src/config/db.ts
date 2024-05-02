import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';

PouchDB.plugin(PouchFind);
// Create a new database instance
export const courseDB = new PouchDB("./var/db/PouchDB/courseDB");
export const userDB = new PouchDB("./var/db/PouchDB/userDB");
export const assignmentDB = new PouchDB("./var/db/PouchDB/assignmentDB");




