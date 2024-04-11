import { Card, DegreeRequirementAssignment } from '../../../lib/types/Degree';
import { Events } from '../../Events';
import { DeleteConfirmation } from '../DeleteConfirmation';

export class AssignedRequirement {
  #assignment: DegreeRequirementAssignment;
  #userCourse: UserCourse;
  #deleteEventId: string;
  #events: Events;
  constructor(assignment: DegreeRequirementAssignment, deleteEventId: string) {
    this.#events = Events.events();
    this.#assignment = assignment;
    this.#userCourse = assignment.userCourse;
    this.#deleteEventId = deleteEventId;
  }
  render(): HTMLDivElement {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = /* HTML */ `
      <div
        class="card-inner group pointer-events-auto relative transition hover:-translate-y-1"
      >
        <div
          class="card-fixed h-56 w-72 overflow-hidden rounded-t-lg shadow-lg group-hover:rounded-b-none sm:rounded-b-lg"
        >
          ${this.#assignment.status === 'completed'
            ? this.getCompletedHTML()
            : this.getInProgressHTML()}
          <div class="w-full bg-slate-50 p-6">
            <div class="mb-4">
              <h2
                class="line-clamp-1 overflow-hidden text-ellipsis text-2xl font-semibold"
              >
                ${this.#userCourse.course.subjectId}
                ${this.#userCourse.course.number}
              </h2>
            </div>
            <div class="mb-4 flex h-14 items-center">
              <h3
                class="text-md line-clamp-2 overflow-hidden text-ellipsis font-normal"
              >
                ${this.#userCourse.course.title}
              </h3>
            </div>
            <div class="mb-4">
              <h4 class="text-md font-semibold">
                Semester:
                <span class="font-normal">${this.#userCourse.semester}</span>
              </h4>
            </div>
          </div>
        </div>
        <div class="delete-div">
          <button
            class="delete-btn focus:shadow-outline absolute bottom-[1] w-full grow rounded-b-md
            bg-gradient-to-br from-red-600 to-red-500 font-bold
            text-white hover:overflow-y-visible hover:from-red-500 hover:to-red-400
            focus:ring-4  group-hover:visible group-hover:block sm:invisible sm:hidden
            py-1"
          >
            <div class="text-gray-50">
              <i class="fa fa-trash"></i>
              Delete
            </div>
          </button>
        </div>
        <!-- Old delete button -->
        <!-- <div
          class="delete-div invisible absolute -right-8 top-8 -mr-4 hidden group-hover:visible sm:block"
        >
          <div class="fixed-size-button h-12 w-12">
            <div
              class="flex flex-col divide-y divide-slate-800 rounded-md bg-white shadow-md shadow-gray-400"
            >
              <button
                class="delete-btn rounded-md bg-slate-50 p-2 text-3xl text-red-600 hover:bg-gray-200 hover:text-gray-800 focus:ring-4"
              >
                <i class="fa fa-trash"></i>
              </button>
            </div>
          </div>
        </div> -->
      </div>
    `;

    const cardFixed = div.querySelector('.card-fixed')! as HTMLDivElement;
    const deleteDivs = div.querySelectorAll('.delete-div');
    deleteDivs.forEach((deleteDiv) => {
      if (this.#assignment.requirement.requirementType === 'fixed') {
        (deleteDiv as HTMLDivElement).style.display = 'none';
        cardFixed.classList.add('rounded-b-md');
        cardFixed.classList.remove('group-hover:rounded-b-none');
      }
      (deleteDiv as HTMLDivElement).style.visibility = 'block';
    });

    div.querySelector('.delete-btn')!.addEventListener('click', () => {
      this.onDelete();
    });
    return div;
  }

  private onDelete(): void {
    const deleteConfirmationModal = new DeleteConfirmation();
    const waitForDelete = deleteConfirmationModal.show();
    waitForDelete.then(() => {
      if (deleteConfirmationModal.isConfirmed()) {
        this.#events.publish(this.#deleteEventId, {
          type: 'requirement',
          requirement: this.#assignment.requirement
        } satisfies Card);
      }
    });
  }

  private getCompletedHTML(): string {
    return /* HTML */ `
      <div class="flex items-center justify-start bg-green-600 p-1">
        <i class="fas fa-check ml-2 text-white"></i>
        <span class="ml-2 font-semibold text-white">Completed</span>
      </div>
    `;
  }

  private getInProgressHTML(): string {
    return /* HTML */ `
      <div class="flex items-center justify-start bg-yellow-500 p-1">
        <svg
          class="ml-2 size-5"
          version="1.1"
          id="_x32_"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 512 512"
          xml:space="preserve"
        >
          <style type="text/css">
            .st0 {
              fill: #ffffff;
            }
          </style>
          <g>
            <polygon
              class="st0"
              points="256,0 72.115,256 256,512 439.885,256 	"
            />
          </g>
        </svg>
        <span class="ml-2 font-semibold text-white">In Progress</span>
      </div>
    `;
  }
}
