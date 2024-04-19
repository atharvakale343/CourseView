import { DegreeRequirementAssignment } from '../lib/types/Degree';
import { compareUserCourses } from '../lib/utils';
import { Events } from './Events';
import { LocalStore, UserAssignmentsDocumentKey } from './LocalStore';

export type ModificationEvent = {
  type: 'change' | 'delete';
  changeRequired: boolean;
};

/**
 * Manages the state of the application by interacting with the local store and handling events.
 */
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

  /**
   * Adds a user assignment to the local store and publishes an event to notify subscribers of the change.
   * @param assignment - The assignment to be added.
   * @returns A promise that resolves when the assignment is successfully added.
   */
  public async addUserAssignment(assignment: DegreeRequirementAssignment) {
    return this.#localStore
      .addUserAssignment(assignment, 'userAssignments')
      .then(() => this.#events.publish('userAssignmentsChanged', null))
      .catch((e) => console.error(e));
  }

  public async hasUserAlreadyTakenCourse(course: Course) {
    const userCourses = await this.#localStore.getUserCourses('userCourses');
    return userCourses.some((userCourse) => userCourse.course.id === course.id);
  }

  /**
   * Deletes an assignment if needed based on the deleted user course.
   * @param deletedUserCourse - The user course that was deleted.
   * @returns A promise that resolves when the assignment is deleted.
   * @throws An error if more than one assignment is found for the same course.
   */
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

  /**
   * Saves a user course to the local store and publishes an event to notify that user courses have changed.
   * @param user_course - The user course to be saved.
   * @returns A promise that resolves when the user course is successfully saved.
   */
  public async saveUserCourse(user_course: UserCourse) {
    return this.#localStore
      .addUserCourse(user_course, 'userCourses')
      .then(() => this.#events.publish('userCoursesChanged', null));
  }

  /**
   * Deletes a user course from the local store and triggers events for user courses change.
   * Also deletes the assignment associated with the user course if needed.
   *
   * @param user_course - The user course to be deleted.
   * @returns A promise that resolves when the user course is deleted and the assignment (if needed) is deleted.
   */
  public async deleteUserCourse(user_course: UserCourse) {
    return this.#localStore
      .deleteUserCourseByCourseId(user_course.course.id, 'userCourses')
      .then(() => this.#events.publish('userCoursesChanged', null))
      .then(() => this.deleteAssignmentIfNeeded(user_course));
  }

  public async addUserSelectedArrConfig(config_id: string) {
    return this.#localStore
      .getUserSelectedArrConfigIds('userSelectedArrConfigIds')
      .then((config_ids) => {
        return this.#localStore.dumpUserSelectedArrConfigIds(
          [...config_ids, config_id],
          'userSelectedArrConfigIds'
        );
      })
      .then(() =>
        this.#events.publish('userSelectedArrConfigIdsChanged', null)
      );
  }

  public async removeUserSelectedArrConfig(config_id: string) {
    return this.#localStore
      .getUserSelectedArrConfigIds('userSelectedArrConfigIds')
      .then((config_ids) => {
        return this.#localStore.dumpUserSelectedArrConfigIds(
          config_ids.filter((id) => id !== config_id),
          'userSelectedArrConfigIds'
        );
      })
      .then(() =>
        this.#events.publish('userSelectedArrConfigIdsChanged', null)
      );
  }

  /**
   * Subscribes to changes in the user's courses.
   *
   * @param callback - The callback function to be called when the user's courses change.
   */
  public subscribeToUserCourseChanges(callback: Function) {
    this.#events.subscribe('userCoursesChanged', callback);
  }

  /**
   * Subscribes to changes in user assignments.
   *
   * @param {Function} callback - The callback function to be called when user assignments change.
   */
  public subscribeToUserAssignmentChanges(callback: Function) {
    this.#events.subscribe('userAssignmentsChanged', callback);
  }

  /**
   * Subscribes to changes in the userAssignmentsModifiedStore and invokes the provided callback function.
   * @param {Function} callback - The callback function to be invoked when the userAssignmentsModifiedStore changes.
   */
  public subscribeToUserAssignmentsModifiedStoreChanges(callback: Function) {
    this.#events.subscribe('userAssignmentsModifiedStoreChanged', callback);
  }

  public subscribeToUserSelectedArrConfigChanges(callback: Function) {
    this.#events.subscribe('userSelectedArrConfigIdsChanged', callback);
  }

  /**
   * Deletes the user assignments modified store.
   * This method removes the user assignments modified document from the local store database,
   * and publishes an event indicating that the user assignments modified store has changed.
   *
   * @returns A promise that resolves when the user assignments modified store is deleted.
   */
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

  /**
   * Replicates user assignments to the local store.
   * Retrieves the modified user assignments from the local store and dumps them into the 'userAssignments' key.
   *
   * @returns A promise that resolves when the user assignments are successfully replicated to the local store.
   */
  async replicateUserAssignmentsToLocalStore() {
    return this.#localStore.dumpUserAssignments(
      await this.#localStore.getUserAssignments('userAssignmentsModified'),
      'userAssignments'
    ).catch((e) => console.error(e));
  }
}
