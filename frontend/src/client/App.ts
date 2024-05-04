import { match } from 'ts-pattern';
import { Navbar, View } from './Navbar';
import { AddCourse } from './add_course/AddCourse';
import { CourseHistory } from './course_history/CourseHistory';
import { DegreeCompletion } from './degree_completion/DegreeCompletion';
import { Events } from './Events';
import { MyAccount } from './MyAccount';
import { LocalStore } from './LocalStore';
import {
  getAllArrConfigs,
  getRequirementAssignments,
  getUserCourses
} from '../backendApi/MockBackend';
import {
  getCSMajor2022ARRConfig,
  getCSMajorARRConfig,
  getGenedARRConfig
} from '../backendApi/ArrConfig';
import { StateManager } from './StateManagement';

type ViewElementMap = { [K in View]: Promise<HTMLElement> };
const REFRESH_EVERY_N_RELOADS = 4;

export interface Component {
  render(): Promise<HTMLElement>;
}

export class App {
  #events: Events = Events.events();
  #mainViewElement: HTMLDivElement;
  #viewToViewElementMap: ViewElementMap | null = null;
  #localStore: LocalStore;
  #stateManager: StateManager;
  constructor() {
    this.#mainViewElement = document.createElement('div');
    this.#localStore = LocalStore.localStore();
    this.#stateManager = StateManager.getManager();
  }

  /**
   * Sets up the application by performing various initialization tasks.
   * This method initializes the local store, creates necessary documents,
   * and performs data dumping operations.
   *
   * @returns {Promise<void>} A promise that resolves when the setup is complete.
   */
  public async setupApp() {
    await this.#localStore.setup();

    await this.#stateManager.getAllUserData();
  }

  async render(): Promise<HTMLElement> {
    // all app contents reside within rootElement
    const rootElement = document.createElement('div')!;
    rootElement.classList.add('w-full', 'flex', 'flex-col');

    const navbarElement = await new Navbar().render();
    rootElement.appendChild(navbarElement);

    this.#viewToViewElementMap = {
      'add-course': new AddCourse().render(),
      'course-history': new CourseHistory().render(),
      'degree-completion': new DegreeCompletion().render(),
      'my-account': new MyAccount().render()
    };

    this.#mainViewElement = document.createElement('div')!;
    this.#mainViewElement.id = 'main-view';
    this.#mainViewElement.classList.add('grow', 'justify-start');
    rootElement.appendChild(this.#mainViewElement);

    this.#events.subscribe('navigateTo', (view: View) =>
      this.#navigateTo(view)
    );

    this.#events.publish('navigateTo', 'my-account' satisfies View);

    return rootElement;
  }

  async #navigateTo(view: View) {
    const progressRing = document.createElement('div');
    progressRing.classList.add(
      'progress-ring',
      'h-svh',
      'items-center',
      'justify-center',
      'flex'
    );
    progressRing.innerHTML = /* HTML */ `
      <div class="mb-60">
        <svg
          aria-hidden="true"
          class="size-16 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
    `;
    this.#mainViewElement.innerHTML = '';
    this.#mainViewElement.appendChild(progressRing);

    match(view)
      .with('add-course', async () => {
        this.#mainViewElement.appendChild(
          await this.#viewToViewElementMap!['add-course']
        );
      })
      .with('course-history', async () => {
        this.#mainViewElement.appendChild(
          await this.#viewToViewElementMap!['course-history']
        );
      })
      .with('degree-completion', async () => {
        this.#mainViewElement.appendChild(
          await this.#viewToViewElementMap!['degree-completion']
        );
      })
      .with('my-account', async () => {
        this.#mainViewElement.appendChild(
          await this.#viewToViewElementMap!['my-account']
        );
      })
      .exhaustive()
      .then(() => {
        this.#mainViewElement.querySelector('.progress-ring')?.remove();
      });
  }
}
