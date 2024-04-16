import { guidGenerator } from '../../lib/utils';
import { Events } from '../Events';
import { LocalStore } from '../LocalStore';
import { StateManager } from '../StateManagement';

export class SemesterEdit {
  #semesterEditModal: HTMLDivElement;
  #events: Events;
  #eventId: string = guidGenerator();
  #userCourses: UserCourse[];
  #localStore: LocalStore;
  #stateManager: StateManager;
  constructor(semesterString: string, userCourses: UserCourse[]) {
    this.#events = Events.events();
    this.#stateManager = StateManager.getManager();
    this.#userCourses = userCourses;
    this.#localStore = LocalStore.localStore();
    const root = document.getElementById('root')!;
    this.#semesterEditModal = document.createElement('div');
    this.#semesterEditModal.id = 'semester-edit';
    root.appendChild(this.#semesterEditModal);

    this.#semesterEditModal.innerHTML = /* HTML */ `
      <div class="modal-bg fixed inset-0 bg-black bg-opacity-70">
        <div
          class="fixed inset-0 m-auto flex h-fit max-h-96 w-fit max-w-screen-sm items-center justify-center rounded-md bg-white shadow-md md:max-h-dvh"
        >
          <div
            class="flex max-h-96 w-full flex-col items-center gap-y-4 overflow-scroll md:max-h-dvh"
          >
            <div class="flex w-full flex-row justify-between px-5 pt-4">
              <h1 class="text-left text-xl font-bold">${semesterString}</h1>
              <button class="close-semester-btn text-2xl hover:text-gray-500">
                <i class="fa fa-times-circle" aria-hidden="true"></i>
              </button>
            </div>
            <div class="px-4 pb-4">
              <table
                class="table-fixed divide-y divide-gray-300 overflow-scroll rounded-lg border border-gray-300 shadow-md"
              >
                <thead>
                  <tr>
                    <th
                      class="w-1/2 bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Course ID
                    </th>
                    <th
                      class="w-1/4 bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Credits
                    </th>
                    <th
                      class="w-1/4 bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  ${userCourses
                    .map(
                      (userCourse) => /* HTML */ `
                        <tr>
                          <td class="px-6 py-4">
                            ${userCourse.course.subjectId}
                            ${userCourse.course.number}
                          </td>
                          <td class="px-6 py-4 text-center">
                            ${userCourse.course.credits}
                          </td>
                          <td class="px-6 py-4 text-center">
                            <button
                              class="course-delete-btn focus:shadow-outline rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500 focus:outline-none"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      `
                    )
                    .join('\n')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    this.#semesterEditModal
      .querySelector('.modal-bg')!
      .addEventListener('click', (e) => {
        if (e.target !== e.currentTarget) return;
        this.onModalClose();
        e.stopPropagation();
      });

    this.#semesterEditModal
      .querySelector('.close-semester-btn')!
      .addEventListener('click', (e) => {
        this.onModalClose();
        e.stopPropagation();
      });

    this.#semesterEditModal
      .querySelectorAll('.course-delete-btn')
      .forEach((btn, index) => {
        btn.addEventListener('click', async (e) => {
          const target = e.currentTarget as HTMLButtonElement;
          const courseRow = target.parentElement
            ?.parentElement as HTMLTableRowElement;
          const toDelete = this.#userCourses[index];
          await this.#stateManager.deleteUserCourse(toDelete);
          courseRow.remove();
        });
      });
  }

  private freezeBody() {
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.position = 'fixed';
  }

  private unfreezeBody() {
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }

  async show() {
    return new Promise<void>((resolve) => {
      this.freezeBody();
      this.#events.subscribe(this.#eventId, () => {
        this.#events.unsubscribeAll(this.#eventId);
        resolve();
      });
    });
  }
  onModalClose(): void {
    this.unfreezeBody();
    this.#events.publish(this.#eventId, null);
    document.getElementById(this.#semesterEditModal.id)!.remove();
  }
}
