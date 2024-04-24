import { Events } from '../Events';
import { SemesterEdit } from '../semester/SemesterEdit';
import { LocalStore } from '../LocalStore';
import { StateManager } from '../StateManagement';
import { SemesterTable } from './SemesterTable';

export class CourseHistory {
  #events: Events;
  #localStore: LocalStore;
  #stateManager: StateManager;
  constructor() {
    this.#events = Events.events();
    this.#localStore = LocalStore.localStore();
    this.#stateManager = StateManager.getManager();
  }

  getTotalCredits(userCourses: UserCourse[]) {
    return userCourses.reduce((sum, uc) => {
      return uc.transferred
        ? sum + Number.parseInt(uc.creditsAwarded)
        : sum + Number.parseInt(uc.course.credits);
    }, 0);
  }

  async refreshView(userCourses: UserCourse[]) {
    const elm = document.createElement('div');
    // fetch user course history

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
        const order = ['Fall', 'Summer', 'Spring', 'Winter'];
        return order.indexOf(aSem) - order.indexOf(bSem);
      }
      return parseInt(bYear) - parseInt(aYear);
    });

    elm.innerHTML = /* HTML */ `
      <div
        class="semester-tables relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      ></div>
    `;

    const semesterTables = elm.querySelector(
      '.semester-tables'
    )! as HTMLDivElement;

    sortedSemesters.forEach((semester) => {
      const semesterTable = new SemesterTable(
        semester,
        coursesBySemester[semester]
      );

      semesterTable.render().then((table) => {
        semesterTables.appendChild(table);
      });
    });

    return elm.firstElementChild as HTMLDivElement;
  }

  async render() {
    const elm = document.createElement('div');
    elm.classList.add(
      'p-4',
      'flex',
      'flex-col',
      'space-y-4',
      'fade-in-element'
    );
    elm.id = 'course-history';

    elm.innerHTML = /* HTML */ `
      <div class="w-full rounded-full bg-gray-300 dark:bg-gray-700">
        <div
          class="credits-progress rounded-full bg-red-500 p-0.5 text-center text-xs font-medium leading-none text-slate-50 sm:text-sm"
          style="width: "
        >
          <h1></h1>
        </div>
      </div>

      <div class="flex w-full flex-row gap-x-2 sm:w-80">
        <button
          class="
        grow rounded
        bg-gradient-to-br from-blue-500
        to-blue-500 px-4 py-2 text-xs font-bold text-white hover:overflow-y-visible hover:from-blue-500 hover:to-blue-400 focus:ring-4 sm:text-base
        "
          id="add-course-btn"
        >
          Add a Course
        </button>
      </div>

      <div class="container-course-history"></div>
    `;

    const addCourseBtn = elm.querySelector(
      '#add-course-btn'
    )! as HTMLButtonElement;
    addCourseBtn.addEventListener('click', async () => {
      await this.#events.publish('navigateTo', 'add-course');
    });

    const containerCourseHistory = elm.querySelector(
      '.container-course-history'
    ) as HTMLDivElement;

    const creditsProgressElement = elm.querySelector(
      '.credits-progress'
    ) as HTMLDivElement;

    const refreshViewHandler = async () => {
      containerCourseHistory.innerHTML = '';
      const userCourses = await this.#localStore.getUserCourses('userCourses');
      containerCourseHistory.appendChild(await this.refreshView(userCourses));
      const totalCredits = this.getTotalCredits(userCourses);
      creditsProgressElement.querySelector('h1')!.textContent =
        `${totalCredits}/120 Credits`;
      creditsProgressElement.style.width = `${Math.min(
        Math.max(30, (totalCredits / 120) * 100),
        100
      )}%`;
    };

    this.#stateManager.subscribeToUserCourseChanges(refreshViewHandler);

    await refreshViewHandler();

    return elm;
  }
}

// how to ensure that our page is loading the course history component every time we come back to the page or open it or refresh it?
