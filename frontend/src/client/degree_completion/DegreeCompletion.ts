import {
  getCSMajorARRConfig,
  getGenedARRConfig
} from '../../backendApi/ArrConfig';
import { Events } from '../Events';
import { SectionCompletion } from './SectionCompletion';

export class DegreeCompletion {
  #events: Events;
  constructor() {
    this.#events = Events.events();
  }

  async render() {
    const elm = document.createElement('div');
    elm.classList.add('p-2');
    elm.innerHTML = /* HTML */ `
      <div class="flex h-full items-center justify-center bg-amber-100">
        <div class="degree-completion flex flex-col gap-y-8 w-full"></div>
      </div>
    `;

    const degreeCompletionElement = elm.querySelector(
      '.degree-completion'
    )! as HTMLDivElement;
    degreeCompletionElement.appendChild(
      new SectionCompletion(getGenedARRConfig()).render()
    );
    degreeCompletionElement.appendChild(
      new SectionCompletion(getCSMajorARRConfig()).render()
    );

    return elm;
  }
}
