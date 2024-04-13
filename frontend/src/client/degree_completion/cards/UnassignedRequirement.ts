import { match } from 'ts-pattern';
import {
  AnonymousRequirement,
  Card,
  DegreeRequirementAssignment,
  FixedRequirement,
  PrefixRequirement,
  Requirement
} from '../../../lib/types/Degree';
import { Events } from '../../Events';
import {
  calculateCourseStatus,
  createMarkedAsCompletedCourse,
  getUnassignedCourses,
  guidGenerator,
  testingUserCourse
} from '../../../lib/utils';
import { CoursePicker } from '../CoursePicker';
import { LocalStore } from '../../LocalStore';

export class UnassignedRequirement {
  #requirement: Requirement;
  #eventId: string;
  #events: Events;
  #localStore: LocalStore;
  constructor(requirement: Requirement, eventId: string) {
    this.#events = Events.events();
    this.#requirement = requirement;
    this.#eventId = eventId;
    this.#localStore = LocalStore.localStore();
  }

  private getAnonRequirementHTMLDiv(
    anonRequirement: AnonymousRequirement
  ): HTMLDivElement {
    const elm = document.createElement('div');
    elm.innerHTML = /* HTML */ `
      <div
        class="card-inner group pointer-events-auto relative transition hover:-translate-y-1"
      >
        <div
          class="flex h-36 w-40 flex-col overflow-hidden rounded-lg shadow-lg md:h-56 md:w-72"
        >
          <div class="flex items-center justify-start bg-slate-600 p-1">
            <svg
              class="ml-2 size-5"
              version="1.1"
              id="_x32_"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
              xml:space="preserve"
            >
              <path
                d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z"
                fill="#FFFFFF"
              />
            </svg>
            <span class="ml-2 text-sm font-semibold text-white md:text-base"
              >Planned</span
            >
          </div>
          <div class="card-contents flex h-full w-full flex-col bg-slate-50">
            <button
              class="assign-btn focus:shadow-outline w-full grow bg-gradient-to-br from-blue-600 to-blue-500 text-sm font-bold text-white hover:overflow-y-visible hover:from-blue-500 hover:to-blue-400 focus:ring-4 md:text-base"
            >
              <i class="fa fa-plus"></i>
              Assign
            </button>
          </div>
        </div>
      </div>
    `;
    const assignBtn = elm.querySelector('.assign-btn')! as HTMLButtonElement;
    assignBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      assignBtn.blur();
      this.showCoursePicker();
    });
    const cardContentsDiv = elm.querySelector(
      '.card-contents'
    )! as HTMLDivElement;
    if (anonRequirement.description) {
      const descriptionDiv = document.createElement('div');
      descriptionDiv.innerHTML = /* HTML */ `
        <div class="mb-1 flex h-12 items-center px-4 md:mb-6 md:h-14 md:px-6">
          <h3
            class="text-md line-clamp-2 overflow-hidden text-ellipsis text-xs font-normal md:text-base"
          >
            ${anonRequirement.description}
          </h3>
        </div>
      `;
      cardContentsDiv.prepend(descriptionDiv);
    }
    if (anonRequirement.designation) {
      const designationDiv = document.createElement('div');
      designationDiv.innerHTML = /* HTML */ `
        <div class="mb-1 px-4 pt-2 md:mb-4 md:px-6 md:pt-6">
          <h2
            class="text-md line-clamp-1 overflow-hidden text-ellipsis font-semibold md:text-2xl"
          >
            ${anonRequirement.designation}
          </h2>
        </div>
      `;
      cardContentsDiv.prepend(designationDiv);
    }
    return elm;
  }

  private getPrefixRequirementHTMLDiv(
    prefixRequirement: PrefixRequirement
  ): HTMLDivElement {
    const elm = document.createElement('div');
    elm.innerHTML = /* HTML */ `
      <div
        class="card-inner group pointer-events-auto relative transition hover:-translate-y-1"
      >
        <div
          class="flex h-36 w-40 flex-col overflow-hidden rounded-lg shadow-lg md:h-56 md:w-72"
        >
          <div class="flex items-center justify-start bg-slate-600 p-1">
            <svg
              class="ml-2 size-5"
              version="1.1"
              id="_x32_"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
              xml:space="preserve"
            >
              <path
                d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z"
                fill="#FFFFFF"
              />
            </svg>
            <span class="ml-2 text-sm font-semibold text-white md:text-base"
              >Planned</span
            >
          </div>
          <div class="flex w-full grow flex-col bg-slate-50">
            <div class="mb-1 px-4 pt-2 md:mb-4 md:px-6 md:pt-6">
              <h2
                class="line-clamp-1 overflow-hidden text-ellipsis font-semibold md:text-2xl"
              >
                ${prefixRequirement.subjectId} ${prefixRequirement.prefix}
              </h2>
            </div>
            <div class="mb-1 flex h-12 items-center px-6 md:mb-6 md:h-14">
              <h3
                class="md:text-md line-clamp-2 overflow-hidden text-ellipsis text-xs font-normal"
              >
                ${prefixRequirement.description}
              </h3>
            </div>
            <button
              class="assign-btn focus:shadow-outline w-full grow bg-gradient-to-br from-blue-600 to-blue-500 text-sm font-bold text-white hover:overflow-y-visible hover:from-blue-500 hover:to-blue-400 focus:ring-4 md:text-base"
            >
              <i class="fa fa-plus"></i>
              Assign
            </button>
          </div>
        </div>
      </div>
    `;
    const assignBtn = elm.querySelector('.assign-btn')! as HTMLButtonElement;
    assignBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      assignBtn.blur();
      this.showCoursePicker();
    });
    return elm;
  }
  private getFixedRequirementHTMLDiv(
    fixedRequirement: FixedRequirement
  ): HTMLDivElement {
    const elm = document.createElement('div');
    elm.innerHTML = /* HTML */ `
      <div
        class="card-inner group pointer-events-auto relative transition hover:-translate-y-1"
      >
        <div
          class="flex h-36 w-40 flex-col overflow-hidden rounded-lg shadow-lg md:h-56 md:w-72"
        >
          <div class="flex items-center justify-start bg-slate-600 p-1">
            <svg
              class="ml-2 size-5"
              version="1.1"
              id="_x32_"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
              xml:space="preserve"
            >
              <path
                d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z"
                fill="#FFFFFF"
              />
            </svg>
            <span class="ml-2 text-sm font-semibold text-white md:text-base"
              >Planned</span
            >
          </div>
          <div class="card-contents flex h-full w-full flex-col bg-slate-50">
            <div class="mb-1 px-4 pt-2 md:mb-4 md:px-6 md:pt-6">
              <h2
                class="line-clamp-1 overflow-hidden text-ellipsis font-semibold md:text-2xl"
              >
                ${fixedRequirement.course.subjectId}
                ${fixedRequirement.course.number}
              </h2>
            </div>
            <div
              class="mb-1 flex h-12 items-center px-4 md:mb-6 md:h-14 md:px-6"
            >
              <h3
                class="text-md line-clamp-2 overflow-hidden text-ellipsis text-xs font-normal md:text-base"
              >
                ${fixedRequirement.course.title}
              </h3>
            </div>
            <button
              class="assign-btn focus:shadow-outline w-full grow bg-gradient-to-br from-blue-600 to-blue-500 text-sm font-bold text-white hover:overflow-y-visible hover:from-blue-500 hover:to-blue-400 focus:ring-4 md:text-base"
            >
              <i class="fa fa-plus"></i>
              Assign
            </button>
          </div>
        </div>
      </div>
    `;
    const assignBtn = elm.querySelector('.assign-btn')! as HTMLButtonElement;
    assignBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      assignBtn.blur();
      this.onAssign({
        type: 'assignment',
        assignment: {
          id: guidGenerator(),
          requirement: fixedRequirement,
          status: calculateCourseStatus(testingUserCourse), // TODO: This should always redirect to Course Add page and be the newly added course (optional)
          userCourse: testingUserCourse
        }
      });
    });
    return elm;
  }

  public createMarkAsCompletedUserCourse(
    req: AnonymousRequirement
  ): UserCourse {
    return {
      semester: 'Completed',
      course: createMarkedAsCompletedCourse(req)
    };
  }

  private async getUserCourses(): Promise<UserCourse[]> {
    return this.#localStore.getUserCourses('userCourses');
  }

  private async getUserAssignments(): Promise<DegreeRequirementAssignment[]> {
    return this.#localStore
      .getUserAssignments('userAssignmentsModified')
      .catch(() => this.#localStore.getUserAssignments('userAssignments'));
  }

  private async showCoursePicker(): Promise<void> {
    const userCourses = getUnassignedCourses(
      await this.getUserCourses(),
      await this.getUserAssignments()
    );
    if (this.#requirement.requirementType === 'anonymous') {
      userCourses.unshift(
        this.createMarkAsCompletedUserCourse(this.#requirement)
      );
    }
    const coursePickerModal = new CoursePicker(userCourses);
    const waitForCourseSelection = coursePickerModal.show();
    return waitForCourseSelection.then(() => {
      if (coursePickerModal.isConfirmed()) {
        const pickedUserCourse = coursePickerModal.getPickedCourse();
        console.assert(
          pickedUserCourse !== undefined,
          'Picked course not found'
        );
        this.onAssign({
          type: 'assignment',
          assignment: {
            id: guidGenerator(),
            requirement: this.#requirement,
            userCourse: pickedUserCourse, // TODO: This should be the picked course
            status: calculateCourseStatus(testingUserCourse) // TODO: This should be accurately set
          }
        } satisfies Card);
      }
    });
  }

  private onAssign(card: Card): void {
    this.#events.publish(this.#eventId, card);
  }

  render() {
    const div = document.createElement('div');
    div.classList.add('card');

    match(this.#requirement)
      .with({ requirementType: 'anonymous' }, () => {
        div.appendChild(
          this.getAnonRequirementHTMLDiv(
            this.#requirement as AnonymousRequirement
          )
        );
      })
      .with({ requirementType: 'prefix' }, () => {
        div.appendChild(
          this.getPrefixRequirementHTMLDiv(
            this.#requirement as PrefixRequirement
          )
        );
      })
      .with({ requirementType: 'fixed' }, () => {
        div.appendChild(
          this.getFixedRequirementHTMLDiv(this.#requirement as FixedRequirement)
        );
      })
      .exhaustive();

    return div;
  }
}
