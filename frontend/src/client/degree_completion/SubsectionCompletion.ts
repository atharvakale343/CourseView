import { Card, Requirement, Subsection } from '../../lib/types/Degree';
import {
  generateCardsForUser,
  guidGenerator
} from '../../lib/utils';
import { Events } from '../Events';
import { LocalStore, UserAssignmentsDocumentKey } from '../LocalStore';
import { ModificationEvent } from '../StateManagement';
import { CardChangedEvent, CardsViewList } from './cards/Cards';

export class SubsectionCompletion {
  subsection: Subsection;
  #events: Events;
  #localStore: LocalStore;
  constructor(subsection: Subsection) {
    this.#events = Events.events();
    this.#localStore = LocalStore.localStore();
    this.subsection = subsection;
  }

  public async render(): Promise<HTMLDivElement> {
    const elm = document.createElement('div');
    elm.classList.add('subsection-completion');
    elm.innerHTML = /* HTML */ `
      <div class="flex flex-col rounded-md bg-slate-50 p-4 shadow-md">
        <h1 class="text-base font-bold md:text-2xl">
          ${this.subsection.title}
        </h1>
        <h2 class="mt-1 max-w-7xl text-xs md:text-base">
          ${this.subsection.description}
        </h2>
      </div>
      <div class="mx-4 mb-4 mt-8 flex h-full items-center justify-center">
        <div
          id="cards"
          class="grid grid-cols-2 place-items-stretch gap-8 md:gap-16 lg:grid-cols-3 2xl:grid-cols-4"
        ></div>
      </div>
    `;

    const cardsElement = elm.querySelector('#cards')!;

    const cardUpdateEvent = guidGenerator();
    const cards = new CardsViewList(
      await this.generateCards(this.subsection.requirements),
      cardUpdateEvent
    );

    this.#events.subscribe(
      cardUpdateEvent,
      async (cardChangeEvent: CardChangedEvent) => {
        await this.cardChanged(cardChangeEvent);
        cardsElement.innerHTML = '';
        cardsElement.append(...cards.getCardElements());
      }
    );

    this.#events.publish(cardUpdateEvent, {
      changed: false
    } satisfies CardChangedEvent);

    return elm;
  }

  private async cardChanged(event: CardChangedEvent) {
    if (!event.changed) return;
    const deleteAssignmentID =
      event.deleted.type === 'assignment' ? event.deleted.assignment.id : null;
    const addAssignment =
      event.added.type === 'assignment' ? event.added.assignment : null;
    if (deleteAssignmentID && addAssignment) {
      throw new Error('Cannot delete and add at the same time');
    }
    if (deleteAssignmentID) {
      this.createIfNotExistsLocalStoreCopy()
        .then(() =>
          this.#localStore.deleteUserAssignmentById(
            deleteAssignmentID,
            'userAssignmentsModified'
          )
        )
        .then(() =>
          this.#events.publish(
            'userAssignmentsModifiedStoreChanged',
            {type: 'change', changeRequired: false} satisfies ModificationEvent
          )
        );
    } else if (addAssignment) {
      this.createIfNotExistsLocalStoreCopy()
        .then(() =>
          this.#localStore.addUserAssignment(
            addAssignment,
            'userAssignmentsModified'
          )
        )
        .then(() =>
          this.#events.publish(
            'userAssignmentsModifiedStoreChanged',
            {type: 'change', changeRequired: false} satisfies ModificationEvent
          )
        );
    }
  }

  private async createIfNotExistsLocalStoreCopy() {
    const id: UserAssignmentsDocumentKey = 'userAssignmentsModified';
    return this.#localStore.db.get(id).catch(() => {
      return this.#localStore
        .createDocument(id, { userAssignments: '[]' })
        .then(() =>
          this.#localStore.cloneUserAssignments('userAssignments', id)
        );
    });
  }

  private async generateCards(reqs: Requirement[]): Promise<Card[]> {
    const userAssignments =
      await this.#localStore.getUserAssignments('userAssignments');

    const cards = generateCardsForUser(userAssignments, reqs);
    return cards;
  }
}
