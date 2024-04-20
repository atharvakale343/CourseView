import { guidGenerator } from '../../lib/utils';
import { DropdownTextField } from '../DropdownTextField';
import { Events } from '../Events';

export class CoursePicker {
  #pickerModal: HTMLDivElement;
  #confirmed: boolean = false;
  #eventId: string = guidGenerator();
  #events: Events;
  #textFieldDatalist: DropdownTextField;
  #userCourses: UserCourse[];
  constructor(userCourses: UserCourse[]) {
    this.#events = Events.events();
    this.#userCourses = userCourses;

    const root = document.getElementById('root')!;
    this.#pickerModal = document.createElement('div');
    this.#pickerModal.id = 'course-pick-modal';
    root.appendChild(this.#pickerModal);

    this.#pickerModal.innerHTML = /* HTML */ `
      <div class="modal-bg fixed inset-0 bg-black bg-opacity-70 z-20">
        <div
          class="fixed inset-0 m-auto flex h-fit max-h-dvh max-w-lg items-center justify-center overflow-visible rounded-md bg-white shadow-md"
        >
          <div class="flex w-full flex-row">
            <form class="pick-course-form grow" onsubmit=""></form>
            <button
              class="assign-btn focus:shadow-outline max-w-12 grow rounded-br-md rounded-tr-md bg-gradient-to-br from-blue-600 to-blue-500 font-bold text-white hover:overflow-y-visible hover:from-blue-500 hover:to-blue-400 focus:ring-4"
            >
              <i class="fa fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    this.#pickerModal
      .querySelector('.modal-bg')!
      .addEventListener('click', (e) => {
        if (e.target !== e.currentTarget) return;
        this.onCancel();
        e.stopPropagation();
      });

    const formElement = this.#pickerModal.querySelector('.pick-course-form')!;
    formElement.addEventListener('submit', (e) => e.preventDefault());

    this.#textFieldDatalist = new DropdownTextField(
      this.#userCourses.map((uc) => this.userCourseToDisplayStr(uc)),
      'course-pick-text',
      'Pick a course to assign...',
      'enter-key'
    );
    const textFieldDatalistElement = this.#textFieldDatalist.render();
    formElement.appendChild(textFieldDatalistElement);

    this.#pickerModal
      .querySelector('.assign-btn')!
      .addEventListener('click', () => {
        if (!this.#textFieldDatalist.validate()) return;
        this.onPicked();
      });
  }

  private userCourseToDisplayStr(userCourse: UserCourse): string {
    return `${userCourse.course.subjectId} ${userCourse.course.displayTitle}`;
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
      this.#textFieldDatalist.updateDropdown();
      this.#events.subscribe(this.#eventId, () => {
        this.#events.unsubscribeAll(this.#eventId);
        resolve();
      });
    });
  }
  isConfirmed(): boolean {
    return this.#confirmed;
  }
  getPickedCourse(): UserCourse {
    console.assert(this.#confirmed, 'Course not confirmed');
    return this.#userCourses.find(
      (userCourse) =>
        this.userCourseToDisplayStr(userCourse) ===
        this.#textFieldDatalist.getSelectedValue()
    )!;
  }
  onPicked(): void {
    this.#confirmed = true;
    this.onModalClose();
  }
  onCancel(): void {
    this.#confirmed = false;
    this.onModalClose();
  }
  onModalClose(): void {
    this.unfreezeBody();
    this.#textFieldDatalist.cleanup();
    this.#events.publish(this.#eventId, null);
    document.getElementById(this.#pickerModal.id)!.remove();
  }
}
