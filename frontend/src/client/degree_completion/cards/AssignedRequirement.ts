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
    div.innerHTML = /*HTML*/ `
    <div class="card-inner group pointer-events-auto relative cursor-pointer transition hover:-translate-y-1">
        <div class="h-56 w-72 overflow-hidden rounded-lg shadow-lg">
            ${this.#assignment.status === 'completed' ? this.getCompletedHTML() : this.getInProgressHTML()}
            <div class="w-full bg-slate-50 p-6">
                <div class="mb-4">
                    <h2 class="line-clamp-1 overflow-hidden text-ellipsis text-2xl font-semibold">${this.#userCourse.course.courseSubjectId} ${this.#userCourse.course.courseNumber}</h2>
                </div>
                <div class="mb-4 flex h-14 items-center">
                    <h3 class="text-md line-clamp-2 overflow-hidden text-ellipsis font-normal">${this.#userCourse.course.courseTitle}</h3>
                </div>
                <div class="mb-4">
                    <h4 class="text-md font-semibold">Semester: <span class="font-normal">${this.#userCourse.semester}</span></h4>
                </div>
            </div>
        </div>
        <div class="delete-div invisible absolute -right-8 top-8 -mr-4 group-hover:visible">
            <div class="fixed-size-button h-12 w-12">
                <div class="flex flex-col divide-y divide-slate-800 rounded-md bg-white shadow-md shadow-gray-400">
                    <button class="delete-btn rounded-md bg-slate-50 p-2 text-3xl text-red-600 hover:bg-gray-200 hover:text-gray-800 focus:ring-4">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
        </div>
    `;

    const deleteDiv = div.querySelector('.delete-div')! as HTMLDivElement;
    deleteDiv.style.visibility =
      this.#assignment.requirement.requirementType === 'fixed'
        ? 'hidden'
        : 'block'

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
