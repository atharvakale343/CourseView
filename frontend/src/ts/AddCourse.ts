import { Events } from './Events';

export class AddCourse {
  #events: Events;

  constructor() {
    this.#events = Events.events();
  }

  async render() {
    // delete everything below, and replace it with the new code
    // this is just a placeholder
    const elm = document.createElement('div');
    elm.classList.add('p-8', 'flex', 'flex-col', 'space-y-4');
    elm.id = 'add-course';
    elm.innerHTML = /* HTML */ `
      <h1 class="text-2xl font-bold text-black">Add Course</h1>
      <h1 class="text-xl font-bold text-black">
        Delete everything below, and replace it with the new code this is just a
        placeholder
      </h1>
      <form id="add-course-form" class="flex flex-col">
        <label for="course-name">Course Name</label>
        <input type="text" id="course-name" name="course-name" />
        <label for="course-number">Course Number</label>
        <input type="text" id="course-number" name="course-number" />
        <button
          type="submit"
          class="
          mt-2 rounded
          bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700
        "
        >
          Add Course
        </button>
      </form>
    `;

    const form = elm.querySelector('form')!;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const courseName = formData.get('course-name') as string;
      const courseNumber = formData.get('course-number') as string;
      await this.#events.publish('addCourse', { courseName, courseNumber });
    });

    return elm;
  }
}
