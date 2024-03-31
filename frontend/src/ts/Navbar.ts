import { match } from 'ts-pattern';
import { Events } from './Events';

const viewToViewLabel = {
  'course-history': 'Your Course History',
  'degree-completion': 'Your Degree Completion Status',
  'add-course': 'Add a Course',
  'my-account': 'My Account'
} as const;

export type View = keyof typeof viewToViewLabel;

export class Navbar {
  #events: Events;
  #currentView: View;

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
      <div class="flex flex-row border-b border-x border-black">
        <h1
          id="view-label"
          class="w-full flex items-center justify-center text-lg text-center sm:text-2xl
              text-black font-bold h-20"
        >
          ${viewToViewLabel[this.#currentView]}
        </h1>
        <div class="flex flex-row space-x-2">
          <a
            id="course-history-icon"
            href="#course-history"
            class="
          px-4 hover:bg-orange-200 rounded-md
        "
          >
            <div
              class="flex flex-col sm:flex-row sm:space-x-2 w-12 sm:w-32 h-full px-1 justify-center items-center"
            >
              <img
                class="size-12"
                src="/course-history-icon.svg"
                alt="Course History"
              />
              <p class="text-center text-xs sm:text-sm">Course History</p>
            </div>
          </a>
          <a
            id="degree-completion-icon"
            href="#degree-completion"
            class="
          px-4 hover:bg-orange-200 rounded-md
        "
          >
            <div
              class="flex flex-col sm:flex-row sm:space-x-2 w-12 sm:w-32 h-full px-1 justify-center items-center"
            >
              <img
                class="size-12"
                src="/degree-icon.svg"
                alt="Degree"
              />
              <p class="text-center text-xs sm:text-sm">Degree Completion</p>
            </div>
          </a>
          <a
            href="#my-account"
            class="
          px-4 hover:bg-orange-200 rounded-md
        "
          >
            <div
              class="flex flex-col sm:flex-row sm:space-x-2 w-12 sm:w-32 h-full px-1 justify-center items-center"
            >
              <img
                class="size-12"
                src="/account-icon.svg"
                alt="Account"
              />
              <p class="text-center text-xs sm:text-sm">Your Account</p>
            </div>
          </a>
        </div>
      </div>
    `;

    // Get all the anchor tags within the <div> element
    const links = elm.querySelectorAll('a');

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

    // Changes the h1 element and nav icons
    this.#events.subscribe('navigateTo', (view: View) => {
      this.changeNavBarLabel(elm, view);

      match(view)
        .with('course-history', () => {
          this.showIcon(elm, 'degree-completion');
        })
        .with('degree-completion', () => {
          this.showIcon(elm, 'course-history');
        });
    });

    // Return the populated navigation bar element
    return elm;
  }

  private showIcon(elm: HTMLDivElement, view: View) {
    const courseHistoryIcon = elm.querySelector(
      '#course-history-icon'
    )! as HTMLAnchorElement;
    courseHistoryIcon.style.display =
      view === 'course-history' ? 'block' : 'none';
    const degreeCompletionIcon = elm.querySelector(
      '#degree-completion-icon'
    )! as HTMLAnchorElement;
    degreeCompletionIcon.style.display =
      view === 'course-history' ? 'none' : 'block';
  }

  private changeNavBarLabel(elm: HTMLDivElement, view: View) {
    const h1 = elm.querySelector('h1')!;
    h1.textContent = viewToViewLabel[view];
  }
}
