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
import { SectionCompletion } from './SectionCompletion';
import { Toolbar } from './Toolbar';

export class DegreeCompletion {
  #events: Events;
  #localStore: LocalStore;
  constructor() {
    this.#events = Events.events();
    this.#localStore = LocalStore.localStore();
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

    this.#events.subscribe('navigateTo', (view: View) => {
      if (view === 'degree-completion') {
        this.#events.publish('degreeCompletionReset', null);
      }
    });

    this.#events.subscribe('degreeCompletionReset', async () => {
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
          this.#localStore.addUserAssignment(assignment, 'userAssignments')
        )
      );

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
    });

    this.#events.publish('degreeCompletionReset', null);

    const toolbarElement = elm.querySelector('.toolbar')! as HTMLDivElement;
    toolbarElement.appendChild(await new Toolbar().render());

    return elm;
  }
}
