import { Events } from './Events';

export class AddCourse {
  #events: Events;

  constructor() {
    this.#events = Events.events();
  }

  async render() {
    const elm = document.createElement('div');
    elm.id = 'add-course';
    elm.innerHTML = /* HTML */ `
      <h1 class="text-2xl text-black font-bold">Add Course</h1>
      <form id="add-course-form" class="flex flex-col">
        <label for="course-name">Course Name</label>
        <input type="text" id="course-name" name="course-name" />
        <label for="course-number">Course Number</label>
        <input type="text" id="course-number" name="course-number" />
        <button type="submit">Add Course</button>
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
