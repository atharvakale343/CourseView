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
      <div class="flex flex-col space-y-4">
        <h1 class="text-2xl font-bold text-black">Degree Completion</h1>
        <h1 class="text-xl font-bold text-black">
          Delete everything below, and replace it with the new code. <br />
          This is just a placeholder.
        </h1>
        <p class="text-black">
          You have completed all the required courses for your degree.
        </p>
      </div>
    `;

    return elm;
  }
}
