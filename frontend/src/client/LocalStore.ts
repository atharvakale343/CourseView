const PouchDB = require('pouchdb-browser');
import { DegreeRequirementAssignment } from '../lib/types/Degree';

export type UserCoursesDocumentKey = 'userCourses' | 'userCoursesModified';
export type UserAssignmentsDocumentKey =
  | 'userAssignments'
  | 'userAssignmentsModified';

export class LocalStore {
  static #instance: LocalStore | null = null;
  db: PouchDB.Database<{}>;

  static localStore() {
    if (!LocalStore.#instance) {
      LocalStore.#instance = new LocalStore();
    }
    return LocalStore.#instance;
  }

  constructor() {
    this.db = new PouchDB('course-view-db');
  }

  public async setup() {
    try {
      await this.db.get('userCourses');
    } catch (e) {
      const error = e as PouchDB.Core.Error;
      if (error.name === 'not_found') {
        await this.createDocument('userCourses', { userCourses: '[]' });
      }
      try {
        await this.db.get('userAssignments');
      } catch (e) {
        const error = e as PouchDB.Core.Error;
        if (error.name === 'not_found') {
          await this.createDocument('userAssignments', {
            userAssignments: '[]'
          });
        }
      }
    }
  }

  public async createDocument(
    id: UserCoursesDocumentKey | UserAssignmentsDocumentKey,
    initialData: { userCourses: string } | { userAssignments: string }
  ) {
    return this.db.put({
      _id: id,
      ...initialData
    });
  }

  public async dumpUserCourses(
    userCourses: UserCourse[],
    destination: UserCoursesDocumentKey
  ) {
    return this.db.get(destination).then((doc) =>
      this.db.put({
        _id: destination,
        _rev: doc._rev,
        userCourses: JSON.stringify(userCourses)
      })
    );
  }

  public async getUserCourses(
    source: UserCoursesDocumentKey
  ): Promise<UserCourse[]> {
    return this.db.get(source).then((doc) => {
      // @ts-ignore
      return JSON.parse(doc.userCourses);
    }) as Promise<UserCourse[]>;
  }

  public async dumpUserAssignments(
    userAssignments: DegreeRequirementAssignment[],
    destination: UserAssignmentsDocumentKey
  ) {
    return this.db.get(destination).then((doc) =>
      this.db.put({
        _id: destination,
        _rev: doc._rev,
        userAssignments: JSON.stringify(userAssignments)
      })
    );
  }

  public async cloneUserAssignments(
    source: UserAssignmentsDocumentKey,
    destination: UserAssignmentsDocumentKey
  ) {
    return this.getUserAssignments(source).then((userAssignments) => {
      return this.dumpUserAssignments(userAssignments, destination);
    });
  }

  public async getUserAssignments(
    source: UserAssignmentsDocumentKey
  ): Promise<DegreeRequirementAssignment[]> {
    return this.db.get(source).then((doc) => {
      // @ts-ignore
      return JSON.parse(doc.userAssignments);
    }) as Promise<DegreeRequirementAssignment[]>;
  }

  public async deleteUserAssignmentById(
    id: string,
    source: UserAssignmentsDocumentKey
  ) {
    return this.getUserAssignments(source).then((userAssignments) => {
      const updatedAssignments = userAssignments.filter(
        (assignment) => assignment.id !== id
      );
      return this.dumpUserAssignments(updatedAssignments, source);
    });
  }

  public async addUserAssignment(
    assignment: DegreeRequirementAssignment,
    destination: UserAssignmentsDocumentKey
  ) {
    return this.getUserAssignments(destination).then((userAssignments) => {
      return this.dumpUserAssignments(
        [...userAssignments, assignment],
        destination
      );
    });
  }
}
