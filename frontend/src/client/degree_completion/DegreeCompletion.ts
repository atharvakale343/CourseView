import {
  generateCardsForUser,
  getAllRequirements,
  getRequirementAssignments
} from '../../backendApi/MockBackend';
import { DegreeRequirementAssignment } from '../../lib/types/Degree';
import { guidGenerator, testingUserCourse } from '../../lib/utils';
import { Events } from '../Events';
import { CardsViewList } from './cards/Cards';

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
      <div class="flex h-full items-center justify-center bg-amber-100">
        <div
          id="cards"
          class="grid grid-cols-1 place-items-center gap-24"
        ></div>
      </div>
    `;

    const cardsElement = elm.querySelector('#cards')!;

    const cardUpdateEvent = guidGenerator();
    const cards = new CardsViewList(
      generateCardsForUser(getRequirementAssignments(), getAllRequirements()),
      cardUpdateEvent
    );

    this.#events.subscribe(cardUpdateEvent, () => {
      cardsElement.innerHTML = '';
      cardsElement.append(...cards.getCardElements());
    });

    this.#events.publish(cardUpdateEvent, cards);

    return elm;
  }
}
