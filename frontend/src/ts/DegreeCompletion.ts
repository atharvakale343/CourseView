import { Events } from './Events';

export class DegreeCompletion {
  #events: Events;
  constructor() {
    this.#events = Events.events();
  }

  async render() {
    const elm = document.createElement('div');
    elm.classList.add('p-8');
    elm.id = 'degree-completion';
    elm.innerHTML = /* HTML */ `
      <h1 class="text-2xl text-black font-bold">Degree Completion</h1>
      <p class="text-black">
        You have completed all the required courses for your degree.
      </p>
    `;

    return elm;
  }
}
