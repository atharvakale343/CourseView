import {
  getCSMajorARRConfig,
  getGenedARRConfig
} from '../../backendApi/ArrConfig';
import {
  autoAssignCourses,
  getAllRequirementsFromSection
} from '../../lib/utils';
import { Events } from '../Events';
import { LocalStore } from '../LocalStore';
import { View } from '../Navbar';
import { ModificationEvent, StateManager } from '../StateManagement';
import { SectionCompletion } from './SectionCompletion';
import { Toolbar } from './Toolbar';

export class DegreeCompletion {
  #events: Events;
  #localStore: LocalStore;
  #stateManager: StateManager;
  constructor() {
    this.#events = Events.events();
    this.#localStore = LocalStore.localStore();
    this.#stateManager = StateManager.getManager();
  }

  public async render() {
    const elm = document.createElement('div');
    elm.classList.add('p-4');
    elm.innerHTML = /* HTML */ `
      <div class="h-full bg-amber-100">
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
          class="degree-container fade-in-element transition flex hidden h-full flex-col items-center justify-center gap-y-4"
        >
          <div class="toolbar sticky top-4 z-10 flex w-full"></div>
          <div class="degree-completion flex w-full flex-col gap-y-8"></div>
        </div>
      </div>
    `;

    const dividerElement = document.createElement('div');
    dividerElement.innerHTML = /* HTML */ `
      <hr
        class="mx-auto h-1 w-48 rounded border-0 bg-gray-400 dark:bg-gray-700"
      />
    `;

    const degreeCompletionElement = elm.querySelector(
      '.degree-completion'
    )! as HTMLDivElement;

    const sections = [getCSMajorARRConfig(), getGenedARRConfig()];

    this.#stateManager.subscribeToUserCourseChanges(async () => {
      const autoAssignments = autoAssignCourses(
        await this.#localStore.getUserCourses('userCourses'),
        getAllRequirementsFromSection(sections),
        await this.#localStore.getUserAssignments('userAssignments')
      );

      console.assert(
        autoAssignments.length !== 0,
        'Assignments should already include auto-assignable assignments'
      );

      await Promise.all(
        autoAssignments.map((assignment) =>
          this.#stateManager.addUserAssignment(assignment)
        )
      );
    });

    const userAssignmentsChangedHandler = async (event: ModificationEvent) => {
      if (event.type !== 'delete' && !event.changeRequired) return;
      degreeCompletionElement.innerHTML = '';
      const sectionElements = await Promise.all(
        sections.map(async (section) => {
          return await new SectionCompletion(section).render();
        })
      );

      sectionElements.forEach((sectionElement, idx) => {
        degreeCompletionElement.appendChild(sectionElement);
        if (idx < sectionElements.length - 1) {
          degreeCompletionElement.appendChild(dividerElement.cloneNode(true));
        }
      });
    };

    this.#stateManager.subscribeToUserAssignmentChanges(
      userAssignmentsChangedHandler
    );

    this.#stateManager.subscribeToUserAssignmentsModifiedStoreChanges(
      userAssignmentsChangedHandler
    );

    userAssignmentsChangedHandler({
      type: 'delete',
      changeRequired: true
    } satisfies ModificationEvent);

    const toolbarElement = elm.querySelector('.toolbar')! as HTMLDivElement;
    toolbarElement.appendChild(await new Toolbar().render());

    const progressRing = elm.querySelector('.progress-ring')! as HTMLDivElement;
    Promise.all([
      customElements.whenDefined('sl-dropdown'),
      customElements.whenDefined('sl-menu'),
      customElements.whenDefined('sl-menu-item'),
      customElements.whenDefined('sl-divider'),
      customElements.whenDefined('sl-icon')
    ]).then(() => {
      progressRing.classList.add('hidden');
      elm.querySelector('.degree-container')!.classList.remove('hidden');
    });

    return elm;
  }
}
