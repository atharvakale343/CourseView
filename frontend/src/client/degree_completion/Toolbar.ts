import { Events } from '../Events';
import { LocalStore, UserAssignmentsDocumentKey } from '../LocalStore';

export class Toolbar {
  #events: Events;
  #localStore: LocalStore;
  constructor() {
    this.#events = Events.events();
    this.#localStore = LocalStore.localStore();
  }

  public async render() {
    const elm = document.createElement('div');
    elm.classList.add('w-full', 'justify-center', 'flex', 'sm:justify-end');
    elm.innerHTML = /* HTML */ `
      <div class="flex w-full flex-row gap-x-2 sm:w-96">
        <button
          class="reset-btn focus:shadow-outline flex w-full grow flex-row items-center
        justify-center gap-x-2 rounded-md bg-gradient-to-br from-red-600 to-red-500
        p-2 font-bold text-white hover:overflow-y-visible hover:from-red-500
        hover:to-red-400 focus:ring-4
        disabled:pointer-events-none disabled:cursor-not-allowed
        disabled:from-slate-600 disabled:to-slate-500 disabled:opacity-50"
          disabled
        >
          <svg
            class="size-6 md:size-8"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.56189 13.5L4.14285 13.9294L4.5724 14.3486L4.99144 13.9189L4.56189 13.5ZM9.92427 15.9243L15.9243 9.92427L15.0757 9.07574L9.07574 15.0757L9.92427 15.9243ZM9.07574 9.92426L15.0757 15.9243L15.9243 15.0757L9.92426 9.07574L9.07574 9.92426ZM19.9 12.5C19.9 16.5869 16.5869 19.9 12.5 19.9V21.1C17.2496 21.1 21.1 17.2496 21.1 12.5H19.9ZM5.1 12.5C5.1 8.41309 8.41309 5.1 12.5 5.1V3.9C7.75035 3.9 3.9 7.75035 3.9 12.5H5.1ZM12.5 5.1C16.5869 5.1 19.9 8.41309 19.9 12.5H21.1C21.1 7.75035 17.2496 3.9 12.5 3.9V5.1ZM5.15728 13.4258C5.1195 13.1227 5.1 12.8138 5.1 12.5H3.9C3.9 12.8635 3.92259 13.2221 3.9665 13.5742L5.15728 13.4258ZM12.5 19.9C9.9571 19.9 7.71347 18.6179 6.38048 16.6621L5.38888 17.3379C6.93584 19.6076 9.54355 21.1 12.5 21.1V19.9ZM4.99144 13.9189L7.42955 11.4189L6.57045 10.5811L4.13235 13.0811L4.99144 13.9189ZM4.98094 13.0706L2.41905 10.5706L1.58095 11.4294L4.14285 13.9294L4.98094 13.0706Z"
              fill="currentColor"
            />
          </svg>
          <h1 class="text-sm md:text-base">Reset Changes</h1>
        </button>
        <button
          class="save-changes-btn focus:shadow-outline flex w-full grow flex-row items-center
    justify-center gap-x-4 rounded-md bg-gradient-to-br from-emerald-600 to-emerald-500
    p-2 font-bold text-white hover:overflow-y-visible hover:from-emerald-500
    hover:to-emerald-400 focus:ring-4
    disabled:pointer-events-none disabled:cursor-not-allowed
        disabled:from-slate-600 disabled:to-slate-500 disabled:opacity-50"
          disabled
        >
          <i class="fa fa-check"></i>
          <h1 class="text-sm md:text-base">Save Changes</h1>
        </button>
      </div>
    `;

    const resetButton = elm.querySelector('.reset-btn')!;
    const saveChangesButton = elm.querySelector('.save-changes-btn')!;

    this.#events.subscribe('userAssignmentsModifiedStoreChanged', () => {
      resetButton.removeAttribute('disabled');
      saveChangesButton.removeAttribute('disabled');
    });

    resetButton.addEventListener('click', async () => {
      resetButton.setAttribute('disabled', '');
      saveChangesButton.setAttribute('disabled', '');
      await this.deleteUserAssignmentsModifiedStore();
      this.#events.publish('degreeCompletionReset', null);
    });

    saveChangesButton.addEventListener('click', async () => {
      resetButton.setAttribute('disabled', '');
      saveChangesButton.setAttribute('disabled', '');
      await this.replicateUserAssignmentsToLocalStore();
    });

    return elm;
  }

  private async deleteUserAssignmentsModifiedStore() {
    return this.#localStore.db
      .get('userAssignmentsModified' satisfies UserAssignmentsDocumentKey)
      .then((doc) => this.#localStore.db.remove(doc));
  }

  private async replicateUserAssignmentsToLocalStore() {
    return this.#localStore
      .dumpUserAssignments(
        await this.#localStore.getUserAssignments('userAssignmentsModified'),
        'userAssignments'
      )
      .then(() => this.deleteUserAssignmentsModifiedStore());
  }
}