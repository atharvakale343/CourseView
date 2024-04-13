import { match } from 'ts-pattern';
import {
  Card,
  DegreeRequirementAssignment,
  Requirement
} from '../../../lib/types/Degree';
import { guidGenerator } from '../../../lib/utils';
import { Events } from '../../Events';
import { AssignedRequirement } from './AssignedRequirement';
import { UnassignedRequirement } from './UnassignedRequirement';

export type CardChangedEvent =
  | {
      changed: true;
      deleted: Card;
      added: Card;
    }
  | { changed: false };

export class CardsViewList {
  #events: Events;
  #cards: [string, Card][];
  #cardsUpdateEvent: string;
  constructor(cards: Card[], cardsUpdateEvent: string) {
    this.#events = Events.events();
    this.#cards = cards.map((card) => this.createNewCardElement(card));
    this.#cardsUpdateEvent = cardsUpdateEvent;
  }

  getCardElements(): HTMLDivElement[] {
    return this.#cards.map(([id, card]) => {
      return match(card)
        .with({ type: 'assignment' }, ({ assignment }) => {
          return new AssignedRequirement(assignment, id).render();
        })
        .with({ type: 'requirement' }, ({ requirement }) => {
          return new UnassignedRequirement(requirement, id).render();
        })
        .exhaustive();
    });
  }

  private createNewCardElement(card: Card): [string, Card] {
    const id = guidGenerator();
    this.#events.subscribe(id, (newCard: Card) => {
      const oldCardIdx = this.#cards.findIndex(([key, _]) => key === id);
      this.#events.unsubscribeAll(id);
      this.#cards[oldCardIdx] = this.createNewCardElement(newCard);
      this.#events.publish(this.#cardsUpdateEvent, {
        deleted: card,
        added: newCard,
        changed: true
      } satisfies CardChangedEvent);
      console.log(
        'cards',
        this.#cards.map((c) => c[1]).filter((r) => r.type === 'assignment')
      );
    });
    return [id, card];
  }
}
