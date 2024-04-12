import { Events } from './Events';
import { getUserCourses } from '../backendApi/MockBackend';

export class CourseHistory {
  #events: Events;
  constructor() {
    this.#events = Events.events();
  }
  async render() {
    const elm = document.createElement('div');
    elm.classList.add('p-8', 'flex', 'flex-col', 'space-y-4');
    elm.id = 'course-history';

    // fetch user course history
    const userCourses = getUserCourses();

    // grouping courses by semester and storing them in an object
    const coursesBySemester = Object.create(null);

    for (let i = 0; i < userCourses.length; i++) {
      const userCourse = userCourses[i];

      const currSemester = userCourse.semester;

      if (!coursesBySemester[currSemester]) {
        coursesBySemester[currSemester] = [];
      }
      coursesBySemester[userCourse.semester].push(userCourse);
    }

    // sort the semesters in descending order by copmaring the string in semester attribute
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

      <div class="carousel flex-no-wrap relative flex space-x-4" id="carousel">
        <button
          class="absolute left-0 top-1/2 flex h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-700"
          id="prev-page-btn"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
        <button
          class="absolute right-0 top-1/2 flex h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-700"
          id="next-page-btn"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
        ${sortedSemesters
          .map(
            (semester, index) => `
              <div class="semester-table bg-gray-100 rounded-lg p-4" style="width: calc(50% - 2rem);">
                <h2 class="text-2xl font-bold text-black mb-2">${semester}</h2>
                <table class="w-full">
                  <thead>
                    <tr>
                      <th class="px-4 py-2">Course ID</th>
                      <th class="px-4 py-2">Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${coursesBySemester[semester]
                      .map(
                        (course: Course) => `
                          <tr>
                            <td class="px-4 py-2">${course.id}</td>
                            <td class="px-4 py-2">${course.credits}</td>
                          </tr>
                        `
                      )
                      .join('')}
                  </tbody>
                </table>
              </div>
              ${index % 2 === 1 && index !== sortedSemesters.length - 1 ? '<div style="width: calc(50% - 2rem);" class="semester-table bg-gray-100 rounded-lg p-4"></div>' : ''}
            `
          )
          .join('')}
      </div>
    `;

    const prevPageBtn = elm.querySelector('#prev-page-btn');
    const nextPageBtn = elm.querySelector('#next-page-btn');
    const carousel = elm.querySelector('#carousel');
    let currentPage = 0;

    // Adding event listener for previous page button
    prevPageBtn?.addEventListener('click', () => {
      if (currentPage > 0) {
        currentPage--;
        const carouselElement = carousel as HTMLElement;
        carouselElement.style.transform = `translateX(-${currentPage * 50}%)`;
      }
    });

    // Adding event listener for next page button
    nextPageBtn?.addEventListener('click', () => {
      if (currentPage < Math.ceil(sortedSemesters.length / 2) - 1) {
        currentPage++;
        const carouselElement = carousel as HTMLElement;
        carouselElement.style.transform = `translateX(-${currentPage * 50}%)`;
      }
    });

    const addCourseBtn = elm.querySelector('#add-course-btn');
    addCourseBtn?.addEventListener('click', async () => {
      await this.#events.publish('navigateTo', 'add-course');
    });

    return elm;
  }
}
