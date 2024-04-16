import { DegreeRequirementAssignment } from '../lib/types/Degree';
import { compareUserCourses } from '../lib/utils';
import { Events } from './Events';
import { LocalStore, UserAssignmentsDocumentKey } from './LocalStore';

export type ModificationEvent = {
  type: 'change' | 'delete';
  changeRequired: boolean;
};

export class StateManager {
  #localStore: LocalStore;
  static #instance: StateManager | null = null;
  #events: Events;

  static getManager() {
    if (!StateManager.#instance) {
      StateManager.#instance = new StateManager();
    }
    return StateManager.#instance;
  }

  constructor() {
    this.#localStore = LocalStore.localStore();
    this.#events = Events.events();
  }

  public async addUserAssignment(assignment: DegreeRequirementAssignment) {
    return this.#localStore
      .addUserAssignment(assignment, 'userAssignments')
      .then(() => this.#events.publish('userAssignmentsChanged', null));
  }

  private async deleteAssignmentIfNeeded(deletedUserCourse: UserCourse) {
    const userAssignments =
      await this.#localStore.getUserAssignments('userAssignments');
    const assignmentsToDelete = userAssignments.filter((assignment) =>
      compareUserCourses(assignment.userCourse, deletedUserCourse)
    );
    if (assignmentsToDelete.length > 1) {
      console.error('More than one assignment found for the same course');
      throw new Error('More than one assignment found for the same course');
    }
    if (assignmentsToDelete.length === 0) {
      console.log('No assignment found for the course');
      return;
    }
    const deleteAssign = assignmentsToDelete[0];
    return this.#localStore
      .deleteUserAssignmentById(deleteAssign.id, 'userAssignments')
      .then(() =>
        this.#events.publish('userAssignmentsChanged', {
          type: 'change',
          changeRequired: true
        } satisfies ModificationEvent)
      );
  }

  public async saveUserCourse(user_course: UserCourse) {
    return this.#localStore
      .addUserCourse(user_course, 'userCourses')
      .then(() => this.#events.publish('userCoursesChanged', null));
  }

  public async deleteUserCourse(user_course: UserCourse) {
    return this.#localStore
      .deleteUserCourseByCourseId(user_course.course.id, 'userCourses')
      .then(() => this.#events.publish('userCoursesChanged', null))
      .then(() => this.deleteAssignmentIfNeeded(user_course));
  }

  public subscribeToUserCourseChanges(callback: Function) {
    this.#events.subscribe('userCoursesChanged', callback);
  }

  public subscribeToUserAssignmentChanges(callback: Function) {
    this.#events.subscribe('userAssignmentsChanged', callback);
  }

  public subscribeToUserAssignmentsModifiedStoreChanges(callback: Function) {
    this.#events.subscribe('userAssignmentsModifiedStoreChanged', callback);
  }

  async deleteUserAssignmentsModifiedStore() {
    return this.#localStore.db
      .get('userAssignmentsModified' satisfies UserAssignmentsDocumentKey)
      .then((doc) => this.#localStore.db.remove(doc))
      .then(() =>
        this.#events.publish('userAssignmentsModifiedStoreChanged', {
          type: 'delete',
          changeRequired: true
        } satisfies ModificationEvent)
      );
  }

  async replicateUserAssignmentsToLocalStore() {
    return this.#localStore.dumpUserAssignments(
      await this.#localStore.getUserAssignments('userAssignmentsModified'),
      'userAssignments'
    );
  }
}
