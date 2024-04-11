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
    <h1></h1>${this.subsection.title}</h1>
    <h2>${this.subsection.description}</h2>
        <div class="flex h-full items-center justify-center bg-amber-100 mt-4">
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
