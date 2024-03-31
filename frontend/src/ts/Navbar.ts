import { match } from 'ts-pattern';
import { Events } from './Events';

const viewToViewLabel = {
  'course-history': 'Your Course History',
  'degree-completion': 'Your Degree Completion Status',
  'add-course': 'Add a Course',
  'my-account': 'My Account'
} as const;

export type View = keyof typeof viewToViewLabel;
type Icon = Exclude<View, 'add-course'>;

export class Navbar {
  #events: Events;
  #currentView: View;
  #viewToViewIcon: { [K in Icon]: HTMLAnchorElement | null } | null = null;

  constructor() {
    this.#events = Events.events();
    this.#currentView = 'course-history';
  }
  async render(): Promise<HTMLElement> {
    // Create a <div> element to hold the navigation bar
    const elm = document.createElement('div');
    elm.id = 'navbar';

    // Populate the <div> element with the navigation links
    elm.innerHTML = /* HTML */ `
      <div class="flex flex-row border-x border-b border-black items-center">
        <h1
          id="view-label"
          class="text-md flex h-20 w-full items-center justify-center px-2 text-center font-bold text-black
              sm:text-xl md:text-2xl"
        >
          ${viewToViewLabel[this.#currentView]}
        </h1>
        <div class="flex flex-row">
          <button
            id="course-history-icon"
            href="#course-history"
            class="
          px-4 hover:bg-slate-100 focus:bg-slate-300
        "
          >
            <div
              class="flex h-full w-12 flex-col items-center justify-center p-2 sm:w-32 sm:flex-row sm:space-x-2"
            >
              <img
                class="size-12"
                src="/course-history-icon.svg"
                alt="Course History"
              />
              <p class="text-center text-xs sm:text-sm">Course History</p>
            </div>
          </button>
          <button
            id="degree-completion-icon"
            href="#degree-completion"
            class="
          px-4 hover:bg-slate-100 focus:bg-slate-300
        "
          >
            <div
              class="flex h-full w-12 flex-col items-center justify-center p-2 sm:w-32 sm:flex-row sm:space-x-2"
            >
              <img class="size-12" src="/degree-icon.svg" alt="Degree" />
              <p class="text-center text-xs sm:text-sm">Degree Completion</p>
            </div>
          </button>
          <button
            id="my-account-icon"
            href="#my-account"
            class="
          px-4 hover:bg-slate-100 focus:bg-slate-300
        "
          >
            <div
              class="flex h-full w-12 flex-col items-center justify-center p-2 sm:w-32 sm:flex-row sm:space-x-2"
            >
              <img class="size-12" src="/account-icon.svg" alt="Account" />
              <p class="text-center text-xs sm:text-sm">Your Account</p>
            </div>
          </button>
        </div>
      </div>
    `;

    // Get all the anchor tags within the <div> element
    const links = elm.querySelectorAll('button');

    // Add event listeners to each anchor tag
    links.forEach((link) => {
      link.addEventListener('click', async (e) => {
        // Prevent the default anchor tag behavior
        e.preventDefault();

        // Get the view name from the href attribute
        const view = (e.currentTarget as HTMLAnchorElement)
          ?.getAttribute('href')
          ?.replace('#', '');

        // Update the window's hash to reflect the current view
        window.location.hash = view!;

        // Call the navigateTo function with the view name
        await this.#events.publish('navigateTo', view);
      });
    });

    // Get all the icon elements and store them
    const courseHistoryIcon = elm.querySelector(
      '#course-history-icon'
    )! as HTMLAnchorElement;

    const degreeCompletionIcon = elm.querySelector(
      '#degree-completion-icon'
    )! as HTMLAnchorElement;

    const myAccountIcon = elm.querySelector(
      '#my-account-icon'
    )! as HTMLAnchorElement;

    this.#viewToViewIcon = {
      'course-history': courseHistoryIcon,
      'degree-completion': degreeCompletionIcon,
      'my-account': myAccountIcon
    };

    // Changes the h1 element and nav icons
    this.#events.subscribe('navigateTo', (view: View) => {
      this.changeNavBarLabel(elm, view);

      console.log(view);

      match(view)
        .with('course-history', () => {
          this.showIcon('course-history');
        })
        .with('degree-completion', () => {
          this.showIcon('degree-completion');
        })
        .with('my-account', () => {
          this.showIcon('my-account');
        });
    });

    // Return the populated navigation bar element
    return elm;
  }

  private showIcon(view: Icon) {
    console.log(view);
    Object.values(this.#viewToViewIcon!).forEach((icon) => {
      icon?.classList?.remove('bg-slate-300'); // Add null check for classList
    });
    this.#viewToViewIcon![view]?.classList?.add('bg-slate-300'); // Add null check for classList
  }

  private changeNavBarLabel(elm: HTMLDivElement, view: View) {
    const h1 = elm.querySelector('h1')!;
    h1.textContent = viewToViewLabel[view];
  }
}
