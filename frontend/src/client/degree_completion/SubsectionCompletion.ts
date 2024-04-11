import { Card, Requirement, Subsection } from '../../lib/types/Degree';
import { guidGenerator } from '../../lib/utils';
import { Events } from '../Events';
import { CardsViewList } from './cards/Cards';

// Actually do this TODO
function generateCardsFromUserCourses(reqs: Requirement[]): Card[] {
  return reqs.map((req: Requirement) => {
    return {
      type: 'requirement',
      requirement: req
    };
  });
}

export class SubsectionCompletion {
  subsection: Subsection;
  #events: Events;
  constructor(subsection: Subsection) {
    this.#events = Events.events();
    this.subsection = subsection;
  }

  public render(): HTMLDivElement {
    const elm = document.createElement('div');
    elm.classList.add('subsection-completion');
    elm.innerHTML = /* HTML */ `
      <div class="flex flex-col rounded-md bg-slate-50 p-4 shadow-md">
        <h1 class="text-xl md:text-2xl font-bold">${this.subsection.title}</h1>
        <h2 class="mt-1 text-sm md:text-base max-w-7xl">${this.subsection.description}</h2>
      </div>
      <div class="mt-4 flex h-full items-center justify-center">
        <div
          id="cards"
          class="grid grid-cols-1 place-items-baseline gap-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        ></div>
      </div>
    `;

    const cardsElement = elm.querySelector('#cards')!;

    const cardUpdateEvent = guidGenerator();
    const cards = new CardsViewList(
      generateCardsFromUserCourses(this.subsection.requirements),
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
