import { serialize } from '@shoelace-style/shoelace';
import { getAccount } from '../backendApi/MockBackend';
import { Events } from './Events';
import { LocalStore } from './LocalStore';
import { StateManager } from './StateManagement';
import { getPastSemesterStrings } from './add_course/CoursesConfig';
const profile = require('../styles/img/profile.svg');
/**
 * Represents the user's account information.
 */
export class MyAccount {
  #events: Events;
  #localStore: LocalStore;
  #stateManager: StateManager;
  constructor() {
    this.#events = Events.events();
    this.#localStore = LocalStore.localStore();
    this.#stateManager = StateManager.getManager();
  }

  /**
   * Renders the MyAccount component.
   * @returns The rendered HTML element.
   */
  async render() {
    const UserAccount = getAccount('01');

    const elm = document.createElement('div');
    elm.classList.add('h-full', 'my-4', 'mx-2', 'fade-in-element');
    elm.id = 'my-account';
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
      <form
        class="account-form mx-auto flex max-w-2xl flex-col gap-y-8 rounded-lg bg-slate-50 p-8 shadow-md"
      >
        <div class="flex flex-row justify-between space-y-4">
          <h1 class="text-2xl font-bold text-black">My Account</h1>
        </div>
        <div class="flex items-center justify-center">
          <img
            class="mb-3 size-48 rounded-full shadow-lg"
            src="/profile.jpg"
            alt="Bonnie image"
          />
        </div>
        <div class="flex flex-col space-y-4">
          <h1 class="text-2xl font-bold text-black">Email:</h1>
          <sl-input
            class="justify-left col-span-2 w-full text-xl text-black"
            value=${UserAccount.email}
            name="email"
            type="email"
            required
          >
          </sl-input>
        </div>
        <div class="flex flex-col space-y-4">
          <h1 class="text-2xl font-bold text-black">Major:</h1>
          <sl-select
            value="${UserAccount.majorCon}"
            class="justify-left col-span-2 w-full text-xl text-black"
            name="major"
            multiple
            clearable
          >
            <sl-option value="computer-science-bs"
              >Computer Science (BS)</sl-option
            >
            <sl-option value="computer-science-ba"
              >Computer Science (BA)</sl-option
            >
            <sl-option value="mathematics">Mathematics (BS)</sl-option>
            <sl-option value="business">Business (BBA)</sl-option>
          </sl-select>
        </div>
        <div class="flex flex-col space-y-4">
          <h2 class="text-2xl font-bold text-black">Expected Graduation:</h2>
          <sl-select
            class="justify-left col-span-2 w-full text-xl text-black"
            name="semester"
            value="${UserAccount.gradSem}"
            clearable
          >
            ${getPastSemesterStrings()
              .map(
                (semester) => /*html*/ `
                    <sl-option value="${semester.value}">${semester.display}</sl-option>
                    `
              )
              .join('\n')}
          </sl-select>
        </div>
        <div class="flex flex-row justify-center space-x-8">
          <sl-button type="submit" variant="primary" class="submit-btn" disabled
            >Save Changes</sl-button
          >
          <sl-button type="reset" variant="danger" class="clear-btn" disabled
            >Clear Changes</sl-button
          >
        </div>
      </form>
    `;

    const formSubmitHandler = async (form: HTMLFormElement) => {
      // TODO
    };

    const form = elm.querySelector('.account-form')! as HTMLFormElement;
    const resetButton = elm.querySelector('.clear-btn')! as HTMLButtonElement;
    const submitButton = elm.querySelector('.submit-btn')! as HTMLButtonElement;

    resetButton.addEventListener('click', (event) => {
      disableFormSubmitAndResetButton();
    });

    let originalFormState: object;

    function hasFormChanged(originalFormData: object, newFormData: object) {
      return JSON.stringify(originalFormData) !== JSON.stringify(newFormData);
    }

    function enableFormSubmitAndResetButton() {
      resetButton.disabled = false;
      submitButton.disabled = false;
    }

    function disableFormSubmitAndResetButton() {
      resetButton.disabled = true;
      submitButton.disabled = true;
    }

    Promise.allSettled([
      customElements.whenDefined('sl-input'),
      customElements.whenDefined('sl-option'),
      customElements.whenDefined('sl-select')
    ]).then(() => {
      originalFormState = serialize(form);
      form.classList.remove('hidden');
      elm.querySelector('.progress-ring')!.classList.add('hidden');
      form.addEventListener('sl-change', () => {
        if (hasFormChanged(originalFormState, serialize(form))) {
          enableFormSubmitAndResetButton();
        } else {
          disableFormSubmitAndResetButton();
        }
      });
      form.addEventListener('sl-input', () => {
        if (hasFormChanged(originalFormState, serialize(form))) {
          enableFormSubmitAndResetButton();
        } else {
          disableFormSubmitAndResetButton();
        }
      });
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        formSubmitHandler(form);
      });
    });
    return elm;
  }
}

// we need some way to dynamically not null user account parameters
