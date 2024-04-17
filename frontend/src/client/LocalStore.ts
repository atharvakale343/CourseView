const PouchDB = require('pouchdb-browser');
import { DegreeRequirementAssignment, Section } from '../lib/types/Degree';

export type UserCoursesDocumentKey = 'userCourses';
export type UserAssignmentsDocumentKey =
  | 'userAssignments'
  | 'userAssignmentsModified';
export type UserSelectedArrConfigIdsDocumentKey = 'userSelectedArrConfigIds';
export type AllArrConfigsDocumentKey = 'allArrConfigs';
/**
 * Represents a local store for managing user courses and assignments.
 */
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
    this.db = new PouchDB('course-view-db', { revs_limit: 10 });
  }

  /**
   * Sets up the local store by checking if the required documents exist in the database.
   * If any of the required documents are not found, they are created with initial values.
   * Finally, the 'userAssignmentsModified' document is removed from the database.
   * @returns A promise that resolves when the setup is complete.
   */
  public async setup() {
    const docsToSetUp = [
      'userCourses',
      'userAssignments',
      'userSelectedArrConfigIds',
      'allArrConfigs'
    ];

    await Promise.all(
      docsToSetUp.map(async (doc_key) => {
        try {
          await this.db.get(doc_key);
        } catch (e) {
          const error = e as PouchDB.Core.Error;
          if (error.name === 'not_found') {
            await this.createDocument(doc_key, { [doc_key]: '[]' });
          }
        }
      })
    );
    return this.db
      .get('userAssignmentsModified')
      .then((doc) => this.db.remove(doc))
      .catch(() => Promise.resolve());
  }

  /**
   * Creates a new document in the local store with the specified ID and initial data.
   * @param id - The ID of the document.
   * @param initialData - The initial data for the document.
   * @returns A promise that resolves when the document is successfully created.
   */
  public async createDocument(id: string, initialData: object) {
    return this.db.put({
      _id: id,
      ...initialData
    });
  }

  /**
   * Dumps the user courses to the specified destination in the database.
   * @param userCourses - The array of user courses to be dumped.
   * @param destination - The key of the document where the user courses will be dumped.
   * @returns A promise that resolves when the user courses are successfully dumped.
   */
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

  /**
   * Adds a user course to the specified destination in the local store.
   *
   * @param userCourse - The user course to be added.
   * @param destination - The destination where the user course should be added.
   * @returns A promise that resolves to the updated user courses.
   */
  public async addUserCourse(
    userCourse: UserCourse,
    destination: UserCoursesDocumentKey
  ) {
    return this.getUserCourses(destination).then((userCourses) => {
      return this.dumpUserCourses([...userCourses, userCourse], destination);
    });
  }

  /**
   * Retrieves the user's courses from the database.
   *
   * @param source - The document key for the user's courses.
   * @returns A promise that resolves to an array of UserCourse objects.
   */
  public async getUserCourses(
    source: UserCoursesDocumentKey
  ): Promise<UserCourse[]> {
    return this.db.get(source).then((doc) => {
      // @ts-ignore
      return JSON.parse(doc.userCourses);
    }) as Promise<UserCourse[]>;
  }

  /**
   * Deletes a user course by courseId.
   *
   * @param courseId - The ID of the course to be deleted.
   * @param source - The source of the user courses.
   * @returns A promise that resolves to the updated user courses after deleting the specified course.
   */
  public async deleteUserCourseByCourseId(
    courseId: string,
    source: UserCoursesDocumentKey
  ) {
    return this.getUserCourses(source).then((userCourses) => {
      const updatedCourses = userCourses.filter(
        (userCourse) => userCourse.course.id !== courseId
      );
      return this.dumpUserCourses(updatedCourses, source);
    });
  }

  /**
   * Dumps the user assignments to the specified destination in the database.
   * @param userAssignments - The user assignments to be dumped.
   * @param destination - The destination key where the user assignments will be stored.
   * @returns A promise that resolves when the user assignments are successfully dumped.
   */
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

  /**
   * Clones the user assignments from the source document to the destination document.
   *
   * @param source - The key of the source document containing user assignments.
   * @param destination - The key of the destination document where user assignments will be cloned.
   * @returns A promise that resolves to the cloned user assignments.
   */
  public async cloneUserAssignments(
    source: UserAssignmentsDocumentKey,
    destination: UserAssignmentsDocumentKey
  ) {
    return this.getUserAssignments(source).then((userAssignments) => {
      return this.dumpUserAssignments(userAssignments, destination);
    });
  }

  /**
   * Retrieves the user assignments from the specified source.
   *
   * @param source - The key to identify the document containing user assignments.
   * @returns A promise that resolves to an array of DegreeRequirementAssignment objects.
   */
  public async getUserAssignments(
    source: UserAssignmentsDocumentKey
  ): Promise<DegreeRequirementAssignment[]> {
    return this.db.get(source).then((doc) => {
      // @ts-ignore
      return JSON.parse(doc.userAssignments);
    }) as Promise<DegreeRequirementAssignment[]>;
  }

  /**
   * Deletes a user assignment by its ID from the specified source.
   *
   * @param id - The ID of the assignment to delete.
   * @param source - The source of the user assignments.
   * @returns A promise that resolves to the updated user assignments after deletion.
   */
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

  /**
   * Adds a user assignment to the specified destination in the local store.
   *
   * @param assignment - The assignment to be added.
   * @param destination - The destination where the assignment should be added.
   * @returns A promise that resolves to the updated user assignments.
   */
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

  public dumpAllArrConfigs(
    sections: Section[],
    destination: AllArrConfigsDocumentKey
  ) {
    return this.db.get(destination).then((doc) =>
      this.db.put({
        _id: destination,
        _rev: doc._rev,
        [destination]: JSON.stringify(sections)
      })
    );
  }

  public getAllArrConfigs(
    source: AllArrConfigsDocumentKey
  ): Promise<Section[]> {
    return this.db.get(source).then((doc) => {
      // @ts-ignore
      return JSON.parse(doc[source]);
    }) as Promise<Section[]>;
  }

  public dumpUserSelectedArrConfigIds(
    ids: string[],
    destination: UserSelectedArrConfigIdsDocumentKey
  ) {
    return this.db.get(destination).then((doc) =>
      this.db.put({
        _id: destination,
        _rev: doc._rev,
        [destination]: JSON.stringify(ids)
      })
    );
  }

  public getUserSelectedArrConfigIds(
    destination: UserSelectedArrConfigIdsDocumentKey
  ): Promise<string[]> {
    return this.db.get(destination).then((doc) => {
      // @ts-ignore
      return JSON.parse(doc[destination]);
    }) as Promise<string[]>;
  }
}
