import { guidGenerator } from '../lib/utils';

/**
 * Represents a dropdown text field component.
 * Offers `render` and `validate` methods.
 */
export class TextFieldDatalist {
  #validValues: string[];
  #formFieldName: string;
  #inputField: HTMLInputElement;
  #datalistId: string = 'datalist-values' + guidGenerator();

  constructor(validValues: string[], formFieldName: string) {
    this.#validValues = validValues;
    this.#formFieldName = formFieldName;
    this.#inputField = document.createElement('input');
  }

  public async render(): Promise<HTMLDivElement> {
    const elm = document.createElement('div');

    elm.innerHTML = /* HTML */ `
      <div class="mx-auto max-w-md">
        <h1 class="text-sm">Autocomplete Text Field</h1>
        <div class="error text-sm text-red-500 opacity-0">Invalid value</div>
        <div class="relative">
          <!-- Input element -->
          <input
            name="${this.#formFieldName}"
            type="text"
            class="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Type something..."
            autocomplete="off"
            list="${this.#datalistId}"
          />
          <!-- Datalist element -->
          <datalist id="${this.#datalistId}">
            ${this.#validValues
              .map((value) => `<option value="${value}"></option>`)
              .join('')}
          </datalist>
        </div>
      </div>
    `;

    // Get input field and dropdown elements
    this.#inputField = elm.querySelector(
      `input[name="${this.#formFieldName}"]`
    )! as HTMLInputElement;
    const errorField = elm.querySelector('.error')! as HTMLDivElement;

    // Function to update dropdown with filtered values
    const textInputEventHandler = () => {
      if (!this.validate()) {
        this.#inputField.classList.add(
          'focus:border-red-500',
          'border-red-500',
          'border-2'
        );
        errorField.classList.remove('opacity-0');
      } else {
        this.#inputField.classList.remove();
        this.#inputField.classList.remove(
          'focus:border-red-500',
          'border-red-500',
          'border-2'
        );
        errorField.classList.add('opacity-0');
      }
    };

    this.#inputField.addEventListener('input', textInputEventHandler);

    return elm;
  }

  public validate(): boolean {
    return this.#validValues.includes(this.#inputField.value);
  }
}
