import { match } from 'ts-pattern';
import { Events } from './Events';

const viewToViewLabel = {
  'course-history': 'Course History',
  'degree-completion': 'Degree Completion',
  'add-course': 'Add a Course',
  'my-account': 'My Account'
} as const;

export type View = keyof typeof viewToViewLabel;
type Icon = Exclude<View, 'add-course'>;

/**
 * Represents a navigation bar component.
 */
export class Navbar {
  #events: Events;
  #currentView: View;
  #viewToViewIcon: { [K in Icon]: HTMLButtonElement | null } | null = null;

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
      <div class="flex flex-row px-1 py-1">
        <h1
          id="view-label"
          class="text-md flex w-full items-center justify-center rounded-md border border-slate-300 bg-gradient-to-br from-slate-100 to-slate-50 px-2 text-center font-bold text-black shadow-md sm:text-xl md:text-2xl"
        >
          ${viewToViewLabel[this.#currentView]}
        </h1>
        <div class="ml-1 flex flex-row gap-x-1">
          <button
            id="course-history-icon"
            href="#course-history"
            class="group rounded-md border border-slate-300 bg-gradient-to-br from-slate-100 to-slate-50 px-4 shadow-md"
          >
            <div
              class="flex h-full w-12 flex-col gap-y-1 sm:gap-y-0 items-center justify-center p-2 sm:w-32 sm:flex-row sm:space-x-2"
            >
              <svg
                class="size-8 sm:size-12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 6L21 6.00078M8 12L21 12.0008M8 18L21 18.0007M3 6.5H4V5.5H3V6.5ZM3 12.5H4V11.5H3V12.5ZM3 18.5H4V17.5H3V18.5Z"
                  class="stoke-change-req stroke-black transition group-hover:stroke-rose-600"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <p
                class="icon-title-text text-center text-xs font-medium transition group-hover:text-rose-600 sm:text-sm"
              >
                Course History
              </p>
            </div>
          </button>
          <button
            id="degree-completion-icon"
            href="#degree-completion"
            class="group rounded-md border border-slate-300 bg-gradient-to-br from-slate-100 to-slate-50 px-4 shadow-md"
          >
            <div
              class="flex h-full w-12 flex-col gap-y-1 sm:gap-y-0 items-center justify-center p-2 sm:w-36 sm:flex-row sm:space-x-2"
            >
              <svg
                class="fill-change-req size-8 transition group-hover:fill-rose-600 sm:size-12"
                version="1.1"
                id="Icons"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 32 32"
                xml:space="preserve"
              >
                <g>
                  <path
                    d="M20,24c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S22.8,24,20,24z"
                  />
                </g>
                <path
                  d="M29,5H3C2.4,5,2,5.4,2,6v20c0,0.6,0.4,1,1,1h11v-4.4c-0.6-1.1-1-2.3-1-3.6c0-3.9,3.1-7,7-7s7,3.1,7,7c0,1.3-0.4,2.5-1,3.6
	V27h3c0.6,0,1-0.4,1-1V6C30,5.4,29.6,5,29,5z M10,16H6c-0.6,0-1-0.4-1-1s0.4-1,1-1h4c0.6,0,1,0.4,1,1S10.6,16,10,16z M13,12H6
	c-0.6,0-1-0.4-1-1s0.4-1,1-1h7c0.6,0,1,0.4,1,1S13.6,12,13,12z"
                />
                <path
                  d="M20,26c-1.5,0-2.9-0.5-4-1.3V31c0,0.3,0.2,0.6,0.4,0.8c0.3,0.2,0.6,0.2,0.9,0.1l2.7-0.9l2.7,0.9c0.1,0,0.2,0.1,0.3,0.1
	c0.2,0,0.4-0.1,0.6-0.2c0.3-0.2,0.4-0.5,0.4-0.8v-6.3C22.9,25.5,21.5,26,20,26z"
                />
              </svg>
              <p
                class="icon-title-text text-center text-xs font-medium transition group-hover:text-rose-600 sm:text-sm"
              >
                Degree Completion
              </p>
            </div>
          </button>
          <button
            id="my-account-icon"
            href="#my-account"
            class="group rounded-md border border-slate-300 bg-gradient-to-br from-slate-100 to-slate-50 px-4 shadow-md"
          >
            <div
              class="flex h-full w-12 flex-col gap-y-1 sm:gap-y-0 items-center justify-center p-2 sm:w-32 sm:flex-row sm:space-x-2"
            >
              <svg
                class="fill-change-req size-8 transition group-hover:fill-rose-600 sm:size-12"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h48v48H0z" fill="none" />
                <g id="Shopicon">
                  <path
                    d="M33.843,26.914L24,36l-9.843-9.086C8.674,30.421,5,36.749,5,44h38C43,36.749,39.326,30.421,33.843,26.914z"
                  />
                  <path
                    d="M24,28c3.55,0,6.729-1.55,8.926-4C34.831,21.876,36,19.078,36,16c0-6.627-5.373-12-12-12S12,9.373,12,16
		c0,3.078,1.169,5.876,3.074,8C17.271,26.45,20.45,28,24,28z"
                  />
                </g>
              </svg>
              <p
                class="icon-title-text text-center text-xs font-medium transition group-hover:text-rose-600 sm:text-sm"
              >
                Your Account
              </p>
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

        if (view === this.#currentView) return;

        // Call the navigateTo function with the view name
        await this.#events.publish('navigateTo', view);
      });
    });

    // Get all the icon elements and store them
    const courseHistoryIcon = elm.querySelector(
      '#course-history-icon'
    )! as HTMLButtonElement;

    const degreeCompletionIcon = elm.querySelector(
      '#degree-completion-icon'
    )! as HTMLButtonElement;

    const myAccountIcon = elm.querySelector(
      '#my-account-icon'
    )! as HTMLButtonElement;

    this.#viewToViewIcon = {
      'course-history': courseHistoryIcon,
      'degree-completion': degreeCompletionIcon,
      'my-account': myAccountIcon
    };

    // Changes the h1 element and nav icons
    this.#events.subscribe('navigateTo', (view: View) => {
      this.changeCurrentView(elm, view);

      match(view)
        .with('course-history', () => {
          this.showIcon('course-history');
        })
        .with('degree-completion', () => {
          this.showIcon('degree-completion');
        })
        .with('my-account', () => {
          this.showIcon('my-account');
        })
        .otherwise(() => {
          this.clearIcons();
        })
    });

    // Return the populated navigation bar element
    return elm;
  }

  private clearIcons() {
    Object.values(this.#viewToViewIcon!).forEach((icon) => {
      const iconTextElement = icon!.querySelector('.icon-title-text')!;
      const iconFillElement = icon!.querySelector('.fill-change-req');
      const iconStrokeElement = icon!.querySelector('.stoke-change-req');
  
      iconTextElement.classList.remove('text-rose-600');
      if (iconFillElement) {
        iconFillElement.classList.remove('fill-rose-600');
      }
      if (iconStrokeElement) {
        iconStrokeElement.classList.remove('stroke-rose-600');
      }
    });
  }

  private showIcon(view: Icon) {
    this.clearIcons();
    const selectedElement = this.#viewToViewIcon![view];
    const iconTextElement = selectedElement!.querySelector('.icon-title-text')!;
    const iconFillElement = selectedElement!.querySelector('.fill-change-req');
    const iconStrokeElement = selectedElement!.querySelector('.stoke-change-req');

    iconTextElement.classList.add('text-rose-600');
    if (iconFillElement) {
      iconFillElement.classList.add('fill-rose-600');
    }
    if (iconStrokeElement) {
      iconStrokeElement.classList.add('stroke-rose-600');
    }
  }

  private changeCurrentView(elm: HTMLDivElement, view: View) {
    this.#currentView = view;
    const h1 = elm.querySelector('h1')!;
    h1.textContent = viewToViewLabel[view];
  }
}
