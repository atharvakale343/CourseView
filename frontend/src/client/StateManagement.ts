import {
  getAllArrConfigs,
  getRequirementAssignments,
  getUserCourses,
  getUserSelectedArrConfigIds
} from '../backendApi/MockBackend';
import { DegreeRequirementAssignment } from '../lib/types/Degree';
import { Account } from '../lib/types/account';
import { Course, UserCourse } from '../lib/types/course';
import { compareUserCourses } from '../lib/utils';
import { Alert } from './Alert';
import { extractJSONFromResponse, fetchBackendRoute } from './BackendConfig';
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

  async getAllUserData() {
    const docsToSetUpAndCallbacks: [string, Function][] = [
      [
        'userCourses',
        async () =>
          this.#localStore
            .dumpUserCourses(await getUserCourses(), 'userCourses')
            .then(() => this.#events.publish('userCoursesChanged', null))
      ],
      [
        'userAssignments',
        async () =>
          this.#localStore
            .dumpUserAssignments(
              await getRequirementAssignments(),
              'userAssignments'
            )
            .then(() =>
              this.#events.publish('userAssignmentsChanged', {
                type: 'change',
                changeRequired: true
              } satisfies ModificationEvent)
            )
            .catch((e) => console.error(e))
      ],
      [
        'allArrConfigs',
        async () =>
          this.#localStore
            .dumpAllArrConfigs(await getAllArrConfigs(), 'allArrConfigs')
            .then(() =>
              this.#events.publish('userSelectedArrConfigIdsChanged', null)
            )
      ],
      [
        'userSelectedArrConfigIds',
        async () =>
          this.#localStore
            .dumpUserSelectedArrConfigIds(
              await getUserSelectedArrConfigIds().catch((e) => {
                console.warn(
                  'Failed to retrieve user selected arr configs from backend',
                  e.message
                );
                return ['gened-arr-config', 'cs-major-arr-config-2016'];
              }),
              'userSelectedArrConfigIds'
            )
            .then(() =>
              this.#events.publish('userSelectedArrConfigIdsChanged', null)
            )
      ]
    ];

    await Promise.all(
      docsToSetUpAndCallbacks.map(async ([_, callback]) => {
        await callback().catch((e: Error) => console.error(e));
      })
    );
  }

  /**
   * Adds a user assignment to the local store and publishes an event to notify subscribers of the change.
   * @param assignment - The assignment to be added.
   * @returns A promise that resolves when the assignment is successfully added.
   */
  public async addUserAssignment(assignment: DegreeRequirementAssignment) {
    await this.#localStore.addUserAssignment(assignment, 'userAssignments');
    return fetchBackendRoute('/userAssignment', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(assignment)
    })
      .then(extractJSONFromResponse)
      .catch(async (e) => {
        await new Alert(`Failed to add assignment: ${e.message}`, 'error').show();
        console.error(e);
        this.deleteUserAssignmentById(assignment.id, 'userAssignments');
        return Promise.reject(e);
      })
      .then(() =>
        this.#events.publish('userAssignmentsChanged', {
          type: 'change',
          changeRequired: true
        } satisfies ModificationEvent)
      )
      .catch((e) => console.error(e));
  }

  /**
   * Checks if the user has already taken a specific course.
   * @param course - The course to check.
   * @returns A boolean indicating whether the user has taken the course.
   */
  public async hasUserAlreadyTakenCourse(course: Course) {
    const userCourses = await this.#localStore.getUserCourses('userCourses');
    return userCourses.some((userCourse) => userCourse.course.id === course.id);
  }

  public async deleteUserAssignmentById(
    assignmentId: string,
    store: UserAssignmentsDocumentKey
  ) {
    await this.#localStore.deleteUserAssignmentById(assignmentId, store);
    return fetchBackendRoute(`/userAssignment?assignmentId=${assignmentId}`, {
      method: 'DELETE'
    })
      .then(extractJSONFromResponse)
      .catch(async (e) => {
        await new Alert(`Failed to delete assignment: ${e.message}`, 'error').show();
        console.error(e);
        return Promise.reject(e);
      });
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
    if (assignmentsToDelete.length === 0) {
      console.log('No assignment found for the course');
      return;
    }
    if (assignmentsToDelete.length > 1) {
      console.warn('More than one assignment found for the course');
      console.warn(`Deleting ${assignmentsToDelete.length} assignments`);
      console.warn('assignmentsToDelete', assignmentsToDelete);
    }
    for (const deleteAssign of assignmentsToDelete) {
      await this.deleteUserAssignmentById(deleteAssign.id, 'userAssignments');
    }
    return this.#events.publish('userAssignmentsChanged', {
      type: 'change',
      changeRequired: true
    } satisfies ModificationEvent);
  }

  /**
   * Saves a user course to the local store and publishes an event to notify that user courses have changed.
   * @param user_course - The user course to be saved.
   * @returns A promise that resolves when the user course is successfully saved.
   */
  public async addUserCourse(user_course: UserCourse) {
    console.log('Adding user course', user_course);
    await this.#localStore.addUserCourse(user_course, 'userCourses');
    return fetchBackendRoute('/userCourse', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(user_course)
    })
      .catch(async (e) => {
        await new Alert(`Internal Server Error ${e.message}`, 'error').show();
        return Promise.reject(e);
      })
      .then(async (res) => {
        if (res.status === 401) {
          await new Alert('Please log in to add courses!', 'error').show();
          return Promise.reject(res);
        } else if (!res.ok) {
          await new Alert(
            `Failed to add course: ${res.statusText}`,
            'error'
          ).show();
          return Promise.reject(res);
        }
        return res;
      })
      .then(extractJSONFromResponse)
      .catch(async (e) => {
        console.error(e);
        this.#localStore.deleteUserCourseByCourseId(
          user_course.course.id,
          'userCourses'
        );
        return Promise.reject(e);
      })
      .then(() => this.#events.publish('userCoursesChanged', null));
  }

  public async removeUserCourses() {
    await this.#localStore.removeUserCourses('userCourses');
    return this.#events.publish('userCoursesChanged', null);
  }

  public async removeUserAssignments() {
    await this.#localStore.removeUserAssignments('userAssignments');
    return this.#events.publish('userAssignmentsChanged', {
      type: 'delete',
      changeRequired: true
    } satisfies ModificationEvent);
  }

  /**
   * Deletes a user course from the local store and triggers events for user courses change.
   * Also deletes the assignment associated with the user course if needed.
   *
   * @param user_course - The user course to be deleted.
   * @returns A promise that resolves when the user course is deleted and the assignment (if needed) is deleted.
   */
  public async deleteUserCourse(user_course: UserCourse) {
    await this.#localStore.deleteUserCourseByCourseId(
      user_course.course.id,
      'userCourses'
    );

    return fetchBackendRoute(`/userCourse?courseId=${user_course.course.id}`, {
      method: 'DELETE'
    })
      .then(extractJSONFromResponse)
      .catch(async (e) => {
        await new Alert(`Failed to delete course: ${e.message}`, 'error').show();
        console.error(e);
        this.#localStore.addUserCourse(user_course, 'userCourses');
        return Promise.reject(e);
      })
      .then(() => this.deleteAssignmentIfNeeded(user_course))
      .catch(async (e) => {
        await new Alert(`Failed to delete course: ${e.message}`, 'error').show();
        console.error(e);
        this.#localStore.addUserCourse(user_course, 'userCourses');
        return Promise.reject(e);
      })
      .then(() => this.#events.publish('userCoursesChanged', null));
  }

  private putUserSelectedArrConfigIds(config_ids: string[]) {
    return fetchBackendRoute('/userSelectedArrConfig', {
      method: 'PUT',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(config_ids)
    }).then((response) => {
      if (response.status === 401) {
        return Promise.resolve();
      }
      return extractJSONFromResponse(response);
    });
  }

  public async removeUserSelectedArrConfigIds() {
    this.#localStore
      .removeUserSelectedArrConfigIds('userSelectedArrConfigIds')
      .then(() =>
        this.#events.publish('userSelectedArrConfigIdsChanged', null)
      );
  }

  /**
   * Adds a configuration ID to the user's selected array configurations.
   *
   * @param config_id - The ID of the configuration to be added.
   * @returns A promise that resolves when the configuration ID is successfully added.
   */
  public async addUserSelectedArrConfig(config_id: string) {
    let oldConfigIds: string[] = [];
    await this.#localStore
      .getUserSelectedArrConfigIds('userSelectedArrConfigIds')
      .then((config_ids) => {
        oldConfigIds = config_ids;
        return this.#localStore.dumpUserSelectedArrConfigIds(
          [...config_ids, config_id],
          'userSelectedArrConfigIds'
        );
      });

    return this.putUserSelectedArrConfigIds([...oldConfigIds, config_id])
      .catch(async (e) => {
        await new Alert(`Failed to add configuration: ${e.message}`, 'error').show();
        console.error(e);
        this.#localStore.dumpUserSelectedArrConfigIds(
          oldConfigIds,
          'userSelectedArrConfigIds'
        );
        return Promise.reject(e);
      })
      .then(() =>
        this.#events.publish('userSelectedArrConfigIdsChanged', null)
      );
  }

  /**
   * Removes a user-selected array configuration by its ID.
   * @param config_id - The ID of the configuration to be removed.
   * @returns A promise that resolves when the configuration is successfully removed.
   */
  public async removeUserSelectedArrConfig(config_id: string) {
    let oldConfigIds: string[] = [];
    let newConfigIds: string[] = [];
    await this.#localStore
      .getUserSelectedArrConfigIds('userSelectedArrConfigIds')
      .then((config_ids) => {
        oldConfigIds = config_ids;
        newConfigIds = config_ids.filter((id) => id !== config_id);
        return this.#localStore.dumpUserSelectedArrConfigIds(
          newConfigIds,
          'userSelectedArrConfigIds'
        );
      });

    return this.putUserSelectedArrConfigIds(newConfigIds)
      .catch(async (e) => {
        await new Alert(`Failed to remove configuration: ${e.message}`, 'error').show();
        console.error(e);
        this.#localStore.dumpUserSelectedArrConfigIds(
          oldConfigIds,
          'userSelectedArrConfigIds'
        );
        return Promise.reject(e);
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

  public subscribeToUserLoggedInChanges(callback: Function) {
    this.#events.subscribe('userLoggedInChanged', callback);
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
    return fetchBackendRoute('/userAssignment', {
      method: 'PUT',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(
        await this.#localStore.getUserAssignments('userAssignmentsModified')
      )
    })
      .then(extractJSONFromResponse)
      .catch(async (e) => {
        if (e.message === 'Unauthorized') {
          await new Alert(
            'Please log in to save user assignments!',
            'error'
          ).show();
        } else {
          await new Alert(
            `Failed to replicate user assignments: ${e.message}`,
            'error'
          ).show();
        }
        console.error(e);
        this.#events.publish('userAssignmentsChanged', {
          type: 'change',
          changeRequired: true
        } satisfies ModificationEvent);
        return Promise.reject(e);
      })
      .then(() =>
        this.#localStore.getUserAssignments('userAssignmentsModified')
      )
      .then((userAssignments) =>
        this.#localStore.dumpUserAssignments(userAssignments, 'userAssignments')
      );
  }

  async saveAccount(account: Account) {
    return this.#localStore
      .dumpUserAccount(account, 'userAccount')
      .then(() => this.#events.publish('userLoggedInChanged', null));
  }

  async logoutAccount() {
    return fetchBackendRoute('/logout', { method: 'POST' })
      .then(extractJSONFromResponse)
      .then(() => this.#localStore.removeUserAccount('userAccount'))
      .then(() => this.#localStore.removeUserCourses('userCourses'))
      .then(() => this.#events.publish('userLoggedInChanged', null))
      .then(() => this.removeUserAssignments())
      .then(() => this.removeUserCourses())
      .then(() => this.removeUserSelectedArrConfigIds());
  }

  async checkLoggedIn() {
    return fetchBackendRoute('/loggedIn')
      .then(extractJSONFromResponse)
      .then((data: any) => data.message === 'success');
  }
}
