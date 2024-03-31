import { Events } from './Events';

export class CourseHistory {
  #events: Events;
  constructor() {
    this.#events = Events.events();
  }
  async render() {
    const elm = document.createElement('div');
    elm.classList.add('p-8', 'flex', 'flex-col', 'space-y-4');
    elm.id = 'course-history';
    elm.innerHTML = /* HTML */ `
      <h1 class="text-2xl text-black font-bold">Course History</h1>
      <h1 class="text-xl font-bold text-black">
        Delete everything below, and replace it with the new code. <br/> This is just a
        placeholder.
      </h1>
      <button
        class="
        bg-blue-500 hover:bg-blue-700
        text-white font-bold py-2 px-4 rounded mt-2
        "
        id="add-course-btn"
      >
        Add a Course
      </button>
      <p class="text-black">You have completed the following courses:</p>
      <ul class="text-black">
        <li>Course 1</li>
        <li>Course 2</li>
        <li>Course 3</li>
      </ul>
    `;

    const addCourseBtn = elm.querySelector('#add-course-btn');
    addCourseBtn?.addEventListener('click', async () => {
      await this.#events.publish('navigateTo', 'add-course');
    });

    return elm;
  }
}
