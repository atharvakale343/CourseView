import { Events } from './Events';

export class MyAccount {
  #events: Events;
  constructor() {
    this.#events = Events.events();
  }

  async render() {
    const elm = document.createElement('div');
    elm.classList.add('p-8');
    elm.id = 'my-account';
    elm.innerHTML = /* HTML */ `
      <h1 class="text-2xl text-black font-bold">My Account</h1>
      <p
        class="text-black
            "
      >
        You can update your account information here.
      </p>
    `;
    return elm;
  }
}
