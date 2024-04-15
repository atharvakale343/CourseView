import { match } from 'ts-pattern';
import { Navbar, View } from './Navbar';
import { AddCourse } from './AddCourse';
import { CourseHistory } from './CourseHistory';
import { DegreeCompletion } from './degree_completion/DegreeCompletion';
import { Events } from './Events';
import { MyAccount } from './MyAccount';
import {
  LocalStore,
  UserAssignmentsDocumentKey,
  UserCoursesDocumentKey
} from './LocalStore';
import {
  getRequirementAssignments,
  getUserCourses
} from '../backendApi/MockBackend';

type ViewElementMap = { [K in View]: HTMLElement };
const REFRESH_EVERY_N_RELOADS = 5;

export class App {
  #events: Events = Events.events();
  #mainViewElement: HTMLDivElement;
  #viewToViewElementMap: ViewElementMap | null = null;
  #localStore: LocalStore;
  constructor() {
    this.#mainViewElement = document.createElement('div');
    this.#localStore = LocalStore.localStore();
  }

  public async setupApp() {
    await this.#localStore.setup();

    // TODO: Delete this when ready to implement the real backend
    await this.#localStore.db.get('refreshed').catch(async () => {
      this.#localStore.createDocument('refreshed', { number: 0 });
    });

    // TODO: Delete this when ready to implement the real backend
    await this.#localStore.db
      .get('userCourses' satisfies UserCoursesDocumentKey)
      .then(async (doc) => {
        if (
          // @ts-ignore
          doc.userCourses === '[]' ||
          // @ts-ignore
          (await this.#localStore.db.get('refreshed')).number ===
            REFRESH_EVERY_N_RELOADS
        ) {
          return this.#localStore.dumpUserCourses(
            getUserCourses(),
            'userCourses'
          );
        }
      })
      .catch((e) => console.error(e));

    // TODO: Delete this when ready to implement the real backend
    await this.#localStore.db
      .get('userAssignments' satisfies UserAssignmentsDocumentKey)
      .then(async (doc) => {
        if (
          // @ts-ignore
          doc.userAssignments === '[]' ||
          // @ts-ignore
          (await this.#localStore.db.get('refreshed')).number ===
            REFRESH_EVERY_N_RELOADS
        ) {
          return this.#localStore.dumpUserAssignments(
            getRequirementAssignments(),
            'userAssignments'
          );
        }
      })
      .catch((e) => console.error(e));

    // TODO: Delete this when ready to implement the real backend
    await this.#localStore.db.get('refreshed').then(async (doc) => {
      // @ts-ignore
      let number = doc.number;
      console.log('number', number);
      if (number >= REFRESH_EVERY_N_RELOADS) {
        number = 0;
      } else {
        number = number + 1;
      }
      // @ts-ignore
      doc.number = number;
      return this.#localStore.db.put(doc);
    });
  }

  async render(): Promise<HTMLElement> {
    // all app contents reside within rootElement
    const rootElement = document.createElement('div')!;
    rootElement.classList.add('w-full');

    const navbarElement = await new Navbar().render();
    rootElement.appendChild(navbarElement);

    this.#viewToViewElementMap = {
      'add-course': await new AddCourse().render(),
      'course-history': await new CourseHistory().render(),
      'degree-completion': await new DegreeCompletion().render(),
      'my-account': await new MyAccount().render()
    };

    this.#mainViewElement = document.createElement('div')!;
    this.#mainViewElement.id = 'main-view';
    rootElement.appendChild(this.#mainViewElement);

    this.#events.subscribe('navigateTo', (view: View) =>
      this.#navigateTo(view)
    );

    this.#events.publish('navigateTo', 'course-history' satisfies View);

    return rootElement;
  }

  async #navigateTo(view: View) {
    this.#mainViewElement.innerHTML = '';

    match(view)
      .with('add-course', () => {
        this.#mainViewElement.appendChild(
          this.#viewToViewElementMap!['add-course']
        );
      })
      .with('course-history', () => {
        this.#mainViewElement.appendChild(
          this.#viewToViewElementMap!['course-history']
        );
      })
      .with('degree-completion', () => {
        this.#mainViewElement.appendChild(
          this.#viewToViewElementMap!['degree-completion']
        );
      })
      .with('my-account', () => {
        this.#mainViewElement.appendChild(
          this.#viewToViewElementMap!['my-account']
        );
      })
      .exhaustive();
  }
}
