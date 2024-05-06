import { guidGenerator } from '../lib/utils';
import { Events } from './Events';

export class Alert {
  #alertModal: HTMLDivElement;
  #eventId: string = guidGenerator();
  #events: Events;

  constructor(message: string, type: 'warn' | 'info' | 'error' = 'info') {
    this.#events = Events.events();
    const root = document.getElementById('root')!;
    this.#alertModal = document.createElement('div');
    this.#alertModal.id = 'alert-modal';
    root.appendChild(this.#alertModal);

    this.#alertModal.innerHTML = /* HTML */ `
      <div class="modal-bg fixed inset-0 bg-black bg-opacity-70">
        <div
          class="fixed inset-0 m-auto flex h-fit py-4 px-4 max-h-dvh w-80 max-w-screen-sm items-center justify-center rounded-md bg-white shadow-md"
        >
          <div class="flex flex-col items-center justify-center gap-y-4">
            <div
              class="${type === 'info'
                ? 'text-green-600'
                : type === 'warn'
                  ? 'text-yellow-500'
                  : 'text-red-600'} text-xl"
            >
              <i
                class="fa ${type === 'info'
                  ? 'fa-check-circle'
                  : 'fa-exclamation-triangle'}"
                aria-hidden="true"
              ></i>
            </div>
            <p class="text-center">${message}</p>
            <div class="flex flex-row gap-x-8">
              <button
                class="alert-btn rounded-md bg-gray-800 p-2 px-4 text-sm text-gray-50 hover:bg-gray-500 focus:ring-2 focus:ring-blue-600"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const alertBtn = this.#alertModal.querySelector(
      '.alert-btn'
    )! as HTMLButtonElement;

    alertBtn.addEventListener('click', (e) => {
      this.onCancel();
      e.stopPropagation();
    });

    alertBtn.focus();

    this.#alertModal
      .querySelector('.modal-bg')!
      .addEventListener('click', (e) => {
        if (e.target !== e.currentTarget) return;
        this.onCancel();
        e.stopPropagation();
      });
  }

  /**
   * Freezes the body of the document by setting the position to 'fixed' and adjusting the top position to maintain the scroll position.
   */
  private freezeBody() {
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.position = 'fixed';
  }

  /**
   * Unfreezes the body element and restores the scroll position.
   */
  private unfreezeBody() {
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }

  /**
   * Displays the delete confirmation dialog.
   * @returns A promise that resolves when the delete confirmation is shown.
   */
  async show() {
    return new Promise<void>((resolve) => {
      this.freezeBody();
      this.#events.subscribe(this.#eventId, () => {
        this.#events.unsubscribeAll(this.#eventId);
        resolve();
      });
    });
  }
  /**
   * Handles the cancel action for the delete confirmation.
   * Sets the `confirmed` flag to false and closes the modal.
   */
  private onCancel(): void {
    this.onModalClose();
  }

  /**
   * Closes the modal and performs necessary cleanup actions.
   */
  private onModalClose(): void {
    this.unfreezeBody();
    this.#events.publish(this.#eventId, null);
    document.getElementById(this.#alertModal.id)!.remove();
  }
}
