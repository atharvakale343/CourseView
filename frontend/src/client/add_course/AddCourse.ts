import { Events } from '../Events';

import { TextFieldDatalist } from '../TextFieldDatalist';
import {
  getAllCoursesDropdown,
  getGradeOptions,
  getPastSemesterStrings,
  getSubjects
} from './CoursesConfig';

export class AddCourse {
  #events: Events;

  constructor() {
    this.#events = Events.events();
  }

  async render() {
    // delete everything below, and replace it with the new code
    // this is just a placeholder
    const elm = document.createElement('div');
    elm.classList.add(
      'p-8',
      'flex',
      'flex-col',
      'space-y-4',
      'mx-auto',
      'max-w-2xl'
    );
    elm.id = 'add-course';
    elm.innerHTML = /* HTML */ `
      <h1 class="text-2xl font-bold text-black">Add A Course</h1>
      <form class="input-validation-required">
        <sl-select
          size="small"
          label="Subject"
          class="subject-dropdown"
          clearable
          required
        >
          ${getSubjects()
            .map((subject) => {
              return /* HTML */ `<sl-option value="${subject.id}"
                >${subject.title} (${subject.id})</sl-option
              >`;
            })
            .join('\n')}
        </sl-select>
        <br />
        <sl-select
          size="small"
          label="Course"
          class="courses-dropdown"
          clearable
          required
          disabled
        >
        </sl-select>
        <br />
        <sl-select
          size="small"
          label="Semester"
          class="semester-dropdown"
          clearable
          required
        >
          ${getPastSemesterStrings()
            .map((semester) => {
              return /* HTML */ `<sl-option value="${semester.value}"
                >${semester.display}</sl-option
              >`;
            })
            .join('\n')}
        </sl-select>
        <br />
        <h1 class="text-lg font-bold">Optional Information</h1>
        <br />
        <sl-input
          size="small"
          label="Professor"
          class="professor-dropdown"
          clearable
        >
        </sl-input>

        <br />
        <sl-select size="small" label="Grade" class="grade-dropdown" clearable>
          ${getGradeOptions()
            .map((grade) => {
              return /* HTML */ `<sl-option value="${grade}"
                >${grade}</sl-option
              >`;
            })
            .join('\n')}
        </sl-select>
        <br />
        <sl-textarea size="small" name="notes" label="Notes"></sl-textarea>
        <br />
        <sl-button size="small" type="submit" variant="primary"
          >Submit</sl-button
        >
      </form>
    `;

    const form = elm.querySelector('.input-validation-required')!;
    const subjectDropdown = elm.querySelector(
      '.subject-dropdown'
    ) as HTMLSelectElement;
    const coursesDropdown = elm.querySelector(
      '.courses-dropdown'
    ) as HTMLSelectElement;

    subjectDropdown.addEventListener('sl-change', () => {
      if (!subjectDropdown.validity.valid) {
        coursesDropdown.value = '';
        coursesDropdown.setAttribute('disabled', '');
        return;
      }
      const courses = getAllCoursesDropdown().filter(
        (json) => json.subjectId === subjectDropdown.value
      )[0].courses;
      coursesDropdown.innerHTML = `${courses
        .map((course) => {
          return /* HTML */ `<sl-option value="${course.id}"
            >${course.displayTitle}</sl-option
          >`;
        })
        .join('\n')}`;
      coursesDropdown.removeAttribute('disabled');
    });

    // Wait for controls to be defined before attaching form listeners
    Promise.allSettled([
      customElements.whenDefined('sl-button'),
      customElements.whenDefined('sl-input'),
      customElements.whenDefined('sl-option'),
      customElements.whenDefined('sl-select'),
      customElements.whenDefined('sl-textarea')
    ]).then(() => {
      console.log('form', form);
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('All fields are valid!');
      });
    }).catch(console.error);

    return elm;
  }
}
