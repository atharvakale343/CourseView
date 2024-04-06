import { DegreeRequirementAssignment } from '../../lib/types/Degree';
import { guidGenerator, testingUserCourse } from '../../lib/utils';
import { Events } from '../Events';
import { Cards } from './cards/Cards';

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
          class="grid grid-cols-2 place-items-center gap-24"
        ></div>
      </div>
    `;

    const cardsElement = elm.querySelector('#cards')!;

    const degreeAssignment: DegreeRequirementAssignment = {
      requirement: { requirementType: 'anonymous' },
      status: 'completed',
      userCourse: testingUserCourse
    };

    const cardUpdateEvent = guidGenerator();
    const cards = new Cards(
      [
        { type: 'assignment', assignment: degreeAssignment },
        { type: 'requirement', requirement: { requirementType: 'anonymous' } },
        {
          type: 'requirement',
          requirement: {
            requirementType: 'prefix',
            courseSubjectId: 'COMPSCI',
            prefix: '3XX+',
            description: 'A CS 300+ Upper level elective'
          }
        },
        {
          type: 'requirement',
          requirement: {
            requirementType: 'fixed',
            course: {
              courseSubjectId: 'COMPSCI',
              courseNumber: '187',
              courseTitle: 'Data Structures',
              courseDescription: '',
              credits: 4
            }
          }
        }
      ],
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
