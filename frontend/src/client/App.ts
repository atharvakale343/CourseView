import { match } from 'ts-pattern';
import { Navbar, View } from './Navbar';
import { AddCourse } from './AddCourse';
import { CourseHistory } from './CourseHistory';
import { DegreeCompletion } from './DegreeCompletion';
import { Events } from './Events';
import { MyAccount } from './MyAccount';

type ViewElementMap = { [K in View]: HTMLElement };

export class App {
  #events: Events = Events.events();
  #mainViewElement: HTMLDivElement;
  #viewToViewElementMap: ViewElementMap | null = null;
  constructor() {
    this.#mainViewElement = document.createElement('div');
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

    this.#events.publish('navigateTo', 'add-course');

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
