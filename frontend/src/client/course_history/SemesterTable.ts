import { UserCourse } from '../../lib/types/course';
import { SemesterEdit } from '../semester/SemesterEdit';

/**
 * Represents a semester table for displaying courses grouped by semester.
 */
export class SemesterTable {
  #userCoursesForSemester: UserCourse[];
  #semester: string;

  constructor(semester: string, userCoursesForSemester: UserCourse[]) {
    this.#semester = semester;
    this.#userCoursesForSemester = userCoursesForSemester;
  }
  /**
   * Renders the semester table.
   * @returns {Promise<HTMLButtonElement>} A promise that resolves to the rendered semester table element.
   */
  async render() {
    const elm = document.createElement('div');

    elm.innerHTML = /* HTML */ `
      <button
        class="semester-table flex w-full cursor-pointer flex-col justify-between rounded-lg
                border border-gray-500 bg-gray-100 p-4 shadow-md transition hover:-translate-y-1
                "
      >
        <div>
          <h2
            class="semester-string mb-2 w-full text-center text-2xl font-bold text-black"
          >
            ${this.#semester}
          </h2>
          <table class="w-full table-fixed">
            <thead>
              <tr>
                <th class="w-1/2 px-4 py-2 text-gray-700">Course ID</th>
                <th
                  class="w-1/2 border-b-2 border-gray-600 px-4 py-2 text-gray-700"
                >
                  Credits
                </th>
              </tr>
            </thead>
            <tbody>
              ${this.#userCoursesForSemester
                .map(
                  (userCourse: UserCourse) => `
                        <tr>
                          <td class="px-4 py-2 ">${userCourse.course.subjectId} ${userCourse.course.number}</td>
                          <td class="px-4 py-2 border-t border-gray-500">${userCourse.transferred ? userCourse.creditsAwarded : userCourse.course.credits}</td>
                        </tr>
                      `
                )
                .join('')}
            </tbody>
          </table>
        </div>

        <table class="w-full table-fixed border border-black">
          <tr class="bg-gray-300 font-bold text-black">
            <td class="w-1/2 px-4 py-2">Total:</td>
            <td class="w-1/2 px-4 py-2 text-lg underline underline-offset-4">
              ${this.#userCoursesForSemester.reduce(
                (total, userCourse) =>
                  total +
                  parseInt(
                    userCourse.transferred
                      ? userCourse.creditsAwarded
                      : userCourse.course.credits
                  ),
                0
              )}
            </td>
          </tr>
        </table>
      </button>
    `;

    const semesterTables = elm.querySelectorAll('.semester-table');

    // adding event listener to each semester table
    semesterTables.forEach((semesterTable) => {
      semesterTable.addEventListener('click', async (e) => {
        const target = e.currentTarget as HTMLButtonElement;
        const semesterString = target
          .querySelector('.semester-string')
          ?.textContent?.trim();

        console.assert(
          semesterString !== undefined,
          'semesterString is undefined'
        );
        await this.showSemesterEdit(
          semesterString!,
          this.#userCoursesForSemester
        );
      });
    });

    return elm.firstElementChild as HTMLButtonElement;
  }

  /**
   * Shows the semester edit modal for editing courses in the semester.
   * @param {string} semesterString - The semester string.
   * @param {UserCourse[]} userCourses - The list of user courses for the semester.
   * @returns {Promise<void>} A promise that resolves when the modal is closed.
   * @private
   */
  private async showSemesterEdit(
    semesterString: string,
    userCourses: UserCourse[]
  ): Promise<void> {
    const semesterModal = new SemesterEdit(semesterString, userCourses);
    const waitForCourseSelection = semesterModal.show();
    return waitForCourseSelection;
  }
}
