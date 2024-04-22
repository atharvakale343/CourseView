import { getAccount } from '../backendApi/MockBackend';
import { Events } from './Events';
import { LocalStore } from './LocalStore';
import { StateManager } from './StateManagement';
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
    elm.classList.add('p-8', 'fade-in-element');
    elm.id = 'my-account';
    elm.innerHTML = /* HTML */ `
      <div
        class="box-border flex flex-col rounded-md bg-slate-50 p-4 shadow-md"
      >
        <div class="flex flex-row justify-between space-y-4">
          <h1 class="text-2xl font-bold text-black">My Account</h1>
          <button
            class="justify-right mt-2 h-10 w-48 rounded bg-blue-500 font-bold text-white hover:bg-blue-700"
            id="chng-pass-btn"
          >
            Change Password
          </button>
        </div>
        <div class="flex items-center justify-center">
          <img src=${profile} class="... h-24 w-24 object-scale-down" />
        </div>
        <h1 class=" text-2xl font-bold text-black">Username:</h1>
        <div class="flex flex-row justify-between gap-4 space-x-4">
          <h3 class="justify-left col-span-2 p-4 text-xl text-black">
            ${UserAccount.username}
          </h3>
          <button
            class=" justify-right mt-2 h-10 w-48 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            id="chng-user-btn"
          >
            Change Username
          </button>
        </div>
        <h1 class="text-2xl font-bold text-black">Email:</h1>
        <div class="flex flex-row justify-between space-x-4">
          <h4 class="justify-left col-span-2 p-4 text-xl text-black">
            ${UserAccount.email}
          </h4>
          <button
            class="justify-right mt-2 h-10 w-48 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            id="chng-email-btn"
          >
            Change Email
          </button>
        </div>
        <h1 class="text-2xl font-bold text-black">Major:</h1>
        <div class="justify-right grid grid-cols-3 gap-4 space-x-4">
          <div class="justify-right grid grid-cols-3 gap-4 space-x-4">
            <h6 class="justify-left col-span-2 p-4 text-xl text-black">
              ${UserAccount.majorCon}
            </h6>
          </div>
        </div>
        <h2 class="text-2xl font-bold text-black">Expected Graduation:</h2>
        <div class="justify-right grid grid-cols-3 gap-4 space-x-4">
          <div class="justify-right grid grid-cols-3 gap-4 space-x-4">
            <h6 class="justify-left col-span-2 p-4 text-xl text-black">
              ${UserAccount.gradSem}
            </h6>
          </div>
        </div>
      </div>
    `;
    return elm;
  }
}

// we need some way to dynamically not null user account parameters
