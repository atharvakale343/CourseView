import { guidGenerator } from '../../lib/utils';
import { Events } from '../Events';

export class CoursePicker {
  #pickerModal: HTMLDivElement;
  #confirmed: boolean = false;
  #eventId: string = guidGenerator();
  #events: Events;
  constructor() {
    this.#events = Events.events();
    const root = document.getElementById('root')!;
    this.#pickerModal = document.createElement('div');
    this.#pickerModal.id = 'delete-modal';
    root.appendChild(this.#pickerModal);

    this.#pickerModal.innerHTML = /* HTML */ `
      <div class="modal-bg fixed inset-0 bg-black bg-opacity-40">
        <div
          class="fixed inset-0 m-auto flex h-80 max-h-dvh w-80 max-w-screen-sm items-center justify-center overflow-visible rounded-md bg-white shadow-md"
        >
          <sl-input
            label="What is your name?"
            autocomplete="off"
            list="dt-list"
          ></sl-input>
          <datalist id="dt-list">
            <sl-option value="USA"></sl-option>
          </datalist>
        </div>
      </div>
    `;

    this.#pickerModal
      .querySelector('.modal-bg')!
      .addEventListener('click', (e) => {
        this.onCancel();
        e.stopPropagation();
      });
  }

  async show() {
    return new Promise<void>((resolve) => {
      this.#events.subscribe(this.#eventId, () => {
        this.#events.unsubscribeAll(this.#eventId);
        resolve();
      });
    });
  }
  isConfirmed(): boolean {
    return this.#confirmed;
  }
  onDelete(): void {
    this.#confirmed = true;
    this.onModalClose();
  }
  onCancel(): void {
    this.#confirmed = false;
    this.onModalClose();
  }
  onModalClose(): void {
    this.#events.publish(this.#eventId, null);
    document.getElementById('delete-modal')!.remove();
  }
}
