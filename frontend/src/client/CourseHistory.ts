import { Events } from './Events';
import { SemesterEdit } from './semester/SemesterEdit';
import { LocalStore } from './LocalStore';
import { StateManager } from './StateManagement';

export class CourseHistory {
  #events: Events;
  #localStore: LocalStore;
  #stateManager: StateManager;
  constructor() {
    this.#events = Events.events();
    this.#localStore = LocalStore.localStore();
    this.#stateManager = StateManager.getManager();
  }

  async refreshView(elm: HTMLDivElement) {
    // fetch user course history
    const userCourses = await this.#localStore.getUserCourses('userCourses');

    // https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
    const distinct = (value: string, index: number, self: Array<string>) =>
      self.indexOf(value) === index;

    // get all the unique semesters from the userCourses
    const semesters = userCourses
      .map((course) => course.semester)
      .filter(distinct);

    // grouping courses by semester and storing them in an object
    const coursesBySemester = semesters.reduce(
      (acc, semester) => {
        acc[semester] = userCourses.filter(
          (course) => course.semester === semester
        );
        return acc;
      },
      {} as { [key: string]: UserCourse[] }
    );

    // sort the semesters in descending order by comparing the string in semester attribute
    // compare the last part of the string to sort the semesters based on year
    // if the years are same, compare the first part of the string to sort the semesters based on spring or fall - fall comes first in descending order
    const sortedSemesters = Object.keys(coursesBySemester).sort((a, b) => {
      const aYear = a.split(' ')[1];
      const bYear = b.split(' ')[1];
      const aSem = a.split(' ')[0];
      const bSem = b.split(' ')[0];

      if (aYear === bYear) {
        if (aSem === 'Fall' && bSem === 'Spring') {
          return -1;
        } else if (aSem === 'Spring' && bSem === 'Fall') {
          return 1;
        }
        return 0;
      }
      return parseInt(bYear) - parseInt(aYear);
    });

    elm.innerHTML = /* HTML */ `
      <h1 class="text-2xl font-bold text-black">Course History</h1>
      <button
        class="
        mt-2 rounded
        bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700
        "
        id="add-course-btn"
      >
        Add a Course
      </button>
      <p class="text-black">You have completed the following courses:</p>

      <div
        class="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        ${sortedSemesters
          .map(
            (semester) => /* HTML */ `
              <button
                class="semester-table flex w-full cursor-pointer flex-col justify-between rounded-lg
                border border-black bg-gray-100 p-4 transition hover:-translate-y-1
                "
              >
                <div>
                  <h2
                    class="semester-string mb-2 w-full text-center text-2xl font-bold text-black"
                  >
                    ${semester}
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
                      ${coursesBySemester[semester]
                        .map(
                          (userCourse: UserCourse) => `
                        <tr>
                          <td class="px-4 py-2 ">${userCourse.course.subjectId} ${userCourse.course.number}</td>
                          <td class="px-4 py-2 border-t border-gray-500">${userCourse.course.credits}</td>
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
                    <td
                      class="w-1/2 px-4 py-2 text-lg underline underline-offset-4"
                    >
                      ${coursesBySemester[semester].reduce(
                        (total, userCourse) =>
                          total + parseInt(userCourse.course.credits),
                        0
                      )}
                    </td>
                  </tr>
                </table>
              </button>
            `
          )
          .join('\n')}
      </div>
    `;

    const semesterTables = elm.querySelectorAll('.semester-table');

    // add event listener to each semester table
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
        const userCourses = coursesBySemester[semesterString!] as UserCourse[];
        console.assert(userCourses !== undefined, 'userCourses is undefined');
        await this.showSemesterEdit(semesterString!, userCourses);
      });
    });

    const addCourseBtn = elm.querySelector('#add-course-btn');
    addCourseBtn?.addEventListener('click', async () => {
      await this.#events.publish('navigateTo', 'add-course');
    });
  }

  async render() {
    const elm = document.createElement('div');
    elm.classList.add('p-8', 'flex', 'flex-col', 'space-y-4', 'fade-in-element');
    elm.id = 'course-history';

    this.#stateManager.subscribeToUserCourseChanges(() =>
      this.refreshView(elm)
    );
    await this.refreshView(elm);

    return elm;
  }

  private async showSemesterEdit(
    semesterString: string,
    userCourses: UserCourse[]
  ): Promise<void> {
    const semesterModal = new SemesterEdit(semesterString, userCourses);
    const waitForCourseSelection = semesterModal.show();
    return waitForCourseSelection;
  }
}

// how to ensure that our page is loading the course history component every time we come back to the page or open it or refresh it?
