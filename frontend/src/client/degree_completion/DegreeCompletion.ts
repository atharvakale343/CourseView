import {
  getCSMajorARRConfig,
  getGenedARRConfig
} from '../../backendApi/ArrConfig';
import { Events } from '../Events';
import { SectionCompletion } from './SectionCompletion';
import { Toolbar } from './Toolbar';

export class DegreeCompletion {
  #events: Events;
  constructor() {
    this.#events = Events.events();
  }

  public async render() {
    const elm = document.createElement('div');
    elm.classList.add('p-4');
    elm.innerHTML = /* HTML */ `
      <div
        class="flex h-full flex-col items-center justify-center gap-y-4 bg-amber-100"
      >
        <div class="toolbar flex w-full"></div>
        <div class="degree-completion flex w-full flex-col gap-y-8"></div>
      </div>
    `;

    const dividerElement = document.createElement('div');
    dividerElement.innerHTML = /* HTML */ `
      <hr
        class="mx-auto h-1 w-48 rounded border-0 bg-gray-300 dark:bg-gray-700"
      />
    `;

    const degreeCompletionElement = elm.querySelector(
      '.degree-completion'
    )! as HTMLDivElement;

    const sections = [
      new SectionCompletion(getCSMajorARRConfig()),
      new SectionCompletion(getGenedARRConfig())
    ];

    this.#events.subscribe('degreeCompletionReset', async () => {
      degreeCompletionElement.innerHTML = '';
      const sectionElements = await Promise.all(
        sections.map(async (section) => {
          return await section.render();
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
