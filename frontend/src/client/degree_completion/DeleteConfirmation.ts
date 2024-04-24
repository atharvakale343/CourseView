import { guidGenerator } from '../../lib/utils';
import { Events } from '../Events';

export class DeleteConfirmation {
  #deleteModal: HTMLDivElement;
  #confirmed: boolean = false;
  #eventId: string = guidGenerator();
  #events: Events;

  constructor() {
    this.#events = Events.events();
    const root = document.getElementById('root')!;
    this.#deleteModal = document.createElement('div');
    this.#deleteModal.id = 'delete-modal';
    root.appendChild(this.#deleteModal);

    this.#deleteModal.innerHTML = /* HTML */ `
      <div class="modal-bg fixed inset-0 bg-black bg-opacity-70">
        <div
          class="fixed inset-0 m-auto flex h-40 max-h-dvh w-80 max-w-screen-sm items-center justify-center rounded-md bg-white shadow-md"
        >
          <div class="flex flex-col items-center justify-center gap-y-4">
            <div class="text-xl text-red-600">
              <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
            </div>
            <h1>Delete Assignment?</h1>
            <div class="flex flex-row gap-x-8">
              <button
                class="delete-btn rounded-md bg-red-600 p-2 px-4 text-sm text-gray-50 hover:bg-red-500 focus:ring-2 focus:ring-blue-600"
              >
                Delete
              </button>
              <button
                class="cancel-btn rounded-md bg-gray-800 p-2 px-4 text-sm text-gray-50 hover:bg-gray-500 focus:ring-2 focus:ring-blue-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const deleteBtn = this.#deleteModal.querySelector(
      '.delete-btn'
    )! as HTMLButtonElement;
    deleteBtn.addEventListener('click', (e) => {
      this.onDelete();
      e.stopPropagation();
    });

    const cancelBtn = this.#deleteModal.querySelector(
      '.cancel-btn'
    )! as HTMLButtonElement;

    cancelBtn.addEventListener('click', (e) => {
      this.onCancel();
      e.stopPropagation();
    });

    cancelBtn.focus();

    this.#deleteModal
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
   * Checks if the deletion has been confirmed.
   * 
   * @returns {boolean} True if the deletion has been confirmed, false otherwise.
   */
  isConfirmed(): boolean {
    return this.#confirmed;
  }
  
  
  /**
   * Marks the confirmation as confirmed and closes the modal.
   */
  onDelete(): void {
    this.#confirmed = true;
    this.onModalClose();
  }
  
  /**
   * Handles the cancel action for the delete confirmation.
   * Sets the `confirmed` flag to false and closes the modal.
   */
  onCancel(): void {
    this.#confirmed = false;
    this.onModalClose();
  }
  
  /**
   * Closes the modal and performs necessary cleanup actions.
   */
  onModalClose(): void {
    this.unfreezeBody();
    this.#events.publish(this.#eventId, null);
    document.getElementById(this.#deleteModal.id)!.remove();
  }
}
