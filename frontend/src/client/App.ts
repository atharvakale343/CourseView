import { match } from 'ts-pattern';
import { Navbar, View } from './Navbar';
import { AddCourse } from './add_course/AddCourse';
import { CourseHistory } from './CourseHistory';
import { DegreeCompletion } from './degree_completion/DegreeCompletion';
import { Events } from './Events';
import { MyAccount } from './MyAccount';
import { LocalStore } from './LocalStore';
import {
  getRequirementAssignments,
  getUserCourses
} from '../backendApi/MockBackend';
import {
  getCSMajor2022ARRConfig,
  getCSMajorARRConfig,
  getGenedARRConfig
} from '../backendApi/ArrConfig';

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

    const docsToSetUpAndCallbacks: [string, Function][] = [
      [
        'userCourses',
        () => this.#localStore.dumpUserCourses(getUserCourses(), 'userCourses')
      ],
      [
        'userAssignments',
        () =>
          this.#localStore
            .dumpUserAssignments(getRequirementAssignments(), 'userAssignments')
            .catch((e) => console.error(e))
      ],
      [
        'allArrConfigs',
        () =>
          this.#localStore.dumpAllArrConfigs(
            [
              getCSMajorARRConfig(),
              getCSMajor2022ARRConfig(),
              getGenedARRConfig()
            ],
            'allArrConfigs'
          )
      ],
      [
        'userSelectedArrConfigIds',
        () =>
          this.#localStore.dumpUserSelectedArrConfigIds(
            ['gened-arr-config', 'cs-major-arr-config-2016'],
            'userSelectedArrConfigIds'
          )
      ]
    ];

    await Promise.all(
      docsToSetUpAndCallbacks.map(async ([doc_key, callback]) => {
        // TODO: Delete this when ready to implement the real backend
        await this.#localStore.db
          .get(doc_key)
          .then(async (doc) => {
            if (
              // @ts-ignore
              doc.doc_key === '[]' ||
              // @ts-ignore
              (await this.#localStore.db.get('refreshed')).number ===
                REFRESH_EVERY_N_RELOADS
            ) {
              return callback();
            }
          })
          .catch((e) => console.error(e));
      })
    );

    // TODO: Delete this when ready to implement the real backend
    await this.#localStore.db.get('refreshed').then(async (doc) => {
      // @ts-ignore
      let number = doc.number;
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

    this.#events.publish('navigateTo', 'course-history' satisfies View);

    return rootElement;
  }

  async #navigateTo(view: View) {
    this.#mainViewElement.innerHTML = '';

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
      .exhaustive();
  }
}
