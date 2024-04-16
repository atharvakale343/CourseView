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
    elm.id = 'add-course';
    elm.innerHTML = /* HTML */ `
      <div class="progress-ring flex h-svh items-center justify-center">
        <div class="mb-60">
          <svg
            aria-hidden="true"
            class="size-16 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div
        class="form-div mx-auto flex hidden max-w-2xl flex-col space-y-4 p-8"
      >
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
          <sl-select
            size="small"
            label="Grade"
            class="grade-dropdown"
            clearable
          >
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
          <div class="flex flex-row gap-x-4">
            <sl-button size="small" type="submit" variant="primary"
              >Submit</sl-button
            >
            <sl-button size="small" type="reset" variant="danger"
              >Clear</sl-button
            >
          </div>
        </form>
      </div>
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
    ])
      .then(() => {
        elm.querySelector('.form-div')!.classList.remove('hidden');
        elm.querySelector('.progress-ring')!.classList.add('hidden');
        console.log('form', form);
        form.addEventListener('submit', (event) => {
          event.preventDefault();
          alert('All fields are valid!');
        });
      })
      .catch(console.error);

    return elm;
  }
}
