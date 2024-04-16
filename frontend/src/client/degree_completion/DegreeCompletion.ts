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
      <div
        class="flex h-full flex-col items-center justify-center gap-y-4 bg-amber-100"
      >
        <div class="toolbar sticky top-4 z-10 flex w-full"></div>
        <div class="degree-completion flex w-full flex-col gap-y-8"></div>
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
        autoAssignments.length === 0,
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

    return elm;
  }
}
