import { fetchBackendRoute } from '../client/BackendConfig';
import { getAllCoursesDropdown } from '../client/add_course/CoursesConfig';
import {
  DegreeRequirementAssignment,
  Requirement,
  Section
} from '../lib/types/Degree';
import { Account } from '../lib/types/account';
import { Course, UserCourse } from '../lib/types/course';

/**
 * Retrieves an account object based on the provided ID.
 * @param id - The ID of the account to retrieve.
 * @returns The account object with the specified ID.
 */
export async function getAccount(): Promise<Account> {
  return fetchBackendRoute(`/getAccountDetails`).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<Account>;
  });
}

/**
 * Retrieves the user"s courses.
 * @returns An array of user courses.
 */
export async function getUserCourses(): Promise<UserCourse[]> {
  return fetchBackendRoute('/userCourse').then((response) => {
    if (response.status === 401) {
      return [];
    }
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<UserCourse[]>;
  });
}

/**
 * Retrieves the mock degree requirement assignments based on the user"s courses.
 * @returns An array of DegreeRequirementAssignment objects representing the user"s degree requirement assignments.
 */
export async function getRequirementAssignments() {
  return fetchBackendRoute('/userAssignment').then((response) => {
    if (response.status === 401) {
      return [];
    }
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<DegreeRequirementAssignment[]>;
  });
}

export async function getAllArrConfigs() {
  return fetchBackendRoute('/arrConfigs').then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<Section[]>;
  });
}
