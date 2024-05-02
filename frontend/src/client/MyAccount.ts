import { serialize } from '@shoelace-style/shoelace';
import { getAccount } from '../backendApi/MockBackend';
import { Events } from './Events';
import { LocalStore } from './LocalStore';
import { StateManager } from './StateManagement';
import { getPastSemesterStrings } from './add_course/CoursesConfig';
import { BACKEND_CONFIG, fetchBackendRoute } from './BackendConfig';
import { Account } from '../lib/types/account';
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
  async renderLoggedIn(userAccount: Account) {
    const elm = document.createElement('div');
    elm.classList.add('my-4', 'mx-4', 'fade-in-element', 'grow');
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
        class="account-form mx-auto flex max-w-2xl flex-col gap-y-4 rounded-lg bg-slate-50 p-8 shadow-md md:gap-y-8"
      >
        <div class="flex items-center justify-center">
          <img
            class="mb-3 size-32 rounded-full shadow-lg md:size-48"
            src="/profile.jpg"
            alt="Bonnie image"
          />
        </div>
        <div class="flex flex-col space-y-4">
          <h1 class="text-xl font-bold text-black md:text-2xl">Email:</h1>
          <sl-input
            class="justify-left col-span-2 w-full text-xl text-black"
            value=${userAccount.email}
            name="email"
            type="email"
            required
            disabled
          >
          </sl-input>
        </div>
        <div class="flex flex-col space-y-4">
          <h1 class="text-xl font-bold text-black md:text-2xl">Major:</h1>
          <sl-select
            value="${userAccount.majors.join(' ')}"
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
          <h2 class="text-xl font-bold text-black md:text-2xl">
            Expected Graduation:
          </h2>
          <sl-select
            class="justify-left col-span-2 w-full text-xl text-black"
            name="semester"
            value="${userAccount.gradSem}"
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
        <div class="flex flex-col justify-center space-y-4">
          <div class="flex flex-row justify-center space-x-8">
            <sl-button
              type="submit"
              variant="primary"
              class="submit-btn"
              disabled
              >Save Changes</sl-button
            >
            <sl-button type="reset" variant="danger" class="clear-btn" disabled
              >Clear Changes</sl-button
            >
          </div>
          <div class="flex flex-row justify-center space-x-8">
            <sl-button type="reset" variant="neutral" class="logout-btn"
              >Logout</sl-button
            >
          </div>
        </div>
      </form>
    `;

    const formSubmitHandler = async (form: HTMLFormElement) => {
      // TODO submit the form to change account details
    };

    const form = elm.querySelector('.account-form')! as HTMLFormElement;
    const resetButton = elm.querySelector('.clear-btn')! as HTMLButtonElement;
    const submitButton = elm.querySelector('.submit-btn')! as HTMLButtonElement;
    const logoutBtn = elm.querySelector('.logout-btn')! as HTMLButtonElement;

    logoutBtn.addEventListener('click', async () => {
      this.#stateManager.logoutAccount();
    });

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

  async renderLoggedOut() {
    const elm = document.createElement('div');
    elm.classList.add('my-4', 'mx-4', 'fade-in-element', 'relative');
    elm.innerHTML = /* HTML */ `
      <div
        class="login-buttons m-auto mb-32 flex h-40 max-w-2xl flex-col items-center gap-y-8 rounded-lg bg-slate-50 p-8 shadow-md md:gap-y-8"
      >
        <h1 class="text-2xl font-bold text-black dark:text-white">
          Sign in to CourseView
        </h1>
        <div class="flex-col items-center justify-center">
          <div class="google-sign-in-button h-11 w-[300px]"></div>
        </div>
      </div>
    `;

    function parseJwt(token: string) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );

      return JSON.parse(jsonPayload);
    }
    function decodeJwtResponse(data: string) {
      console.log(parseJwt(data));
    }

    const handleCredentialResponse = async (response: {
      credential: string;
    }) => {
      console.log(response);
      decodeJwtResponse(response.credential);

      return fetchBackendRoute('/auth/one-tap/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          credential: response.credential
        }),
        credentials: 'include'
      })
        .then((response) => response.json())
        .then((res) => console.log('res', res))
        .then(() => {
          // TODO: actually save userAccount
          return this.#stateManager.saveAccount(getAccount('1'));
        });
    };

    google.accounts.id.initialize({
      client_id: BACKEND_CONFIG.GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse
    });

    const signInBtn = elm.querySelector(
      '.google-sign-in-button'
    )! as HTMLDivElement;
    google.accounts.id.renderButton(signInBtn, {
      type: 'standard',
      theme: 'filled_blue',
      size: 'large',
      shape: 'rectangular',
      width: 300,
      logo_alignment: 'left'
    });

    return elm;
  }

  async render() {
    const elm = document.createElement('div');
    elm.classList.add('h-full', 'flex', 'items-center', 'justify-center');

    const userLoggedInEventHandler = async () => {
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
      `;
      if (
        await this.#stateManager
          .checkLoggedIn()
          .catch((e) => (console.error(e), false))
      ) {
        const userAccount = await this.#localStore
          .getUserAccount('userAccount')
          .catch(() => {
            console.error('Error getting user account');
            return this.#stateManager.saveAccount(getAccount('1'));
          })
          .then(() => this.#localStore.getUserAccount('userAccount'));
        elm.appendChild(await this.renderLoggedIn(userAccount));
      } else {
        elm.appendChild(await this.renderLoggedOut());
      }
      elm.querySelector('.progress-ring')!.classList.add('hidden');
    };

    this.#stateManager.subscribeToUserLoggedInChanges(userLoggedInEventHandler);

    userLoggedInEventHandler();

    return elm;
  }
}

// we need some way to dynamically not null user account parameters
