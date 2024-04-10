/**
 * Represents a dropdown text field component.
 * Offers `render` and `validate` methods.
 */
export class DropdownTextField {
  #validValues: string[];
  #formFieldName: string;
  #inputField: HTMLInputElement;
  #placeholder: string | undefined;
  #currentSelection: HTMLDivElement | null = null;
  updateDropdown: () => void = () => {
    throw new Error('updateDropdown can be called only after render');
  };
  #icon: 'arrow-down' | 'enter-key' = 'arrow-down';
  #documentEventListerners: { event: string; listener: EventListener }[] = [];

  constructor(
    validValues: string[],
    formFieldName: string,
    placeholder?: string,
    icon: 'arrow-down' | 'enter-key' = 'arrow-down'
  ) {
    this.#validValues = validValues;
    this.#formFieldName = formFieldName;
    this.#inputField = document.createElement('input');
    this.#placeholder = placeholder;
    this.#icon = icon;
  }

  public cleanup(): void {
    this.#documentEventListerners.forEach(({ event, listener }) => {
      document.removeEventListener(event, listener);
    });
  }

  public render(): HTMLDivElement {
    const elm = document.createElement('div');

    const iconString =
      this.#icon === 'arrow-down'
        ? /* HTML */ `
            <svg
              class="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 10l7 7 7-7"
              ></path>
            </svg>
          `
        : /* HTML */ `
            <svg
              stroke="currentColor"
              class="h-8 w-8 text-gray-400"
              viewBox="0 0 256 256"
              id="Flat"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M70.72168,128.3916c.22412-.273.46289-.53271.71-.78467.02881-.02978.05322-.0625.083-.09228l24-24a12.0001,12.0001,0,0,1,16.9707,16.9707L108.9707,124H164V104a12,12,0,0,1,24,0v32a12.0006,12.0006,0,0,1-12,12H108.9707l3.51465,3.51465a12.0001,12.0001,0,0,1-16.9707,16.9707l-24-24c-.02979-.02978-.0542-.0625-.083-.09228-.24707-.252-.48584-.51172-.71-.78467-.12354-.15039-.23145-.30908-.34668-.46387-.11816-.15869-.24121-.31348-.35156-.478-.12012-.18017-.2251-.3667-.335-.55127-.08985-.15185-.18555-.2998-.269-.45605-.10009-.18652-.18505-.37842-.27441-.56885-.07715-.16455-.15967-.32617-.22949-.49463-.07666-.18554-.13916-.375-.20606-.56347-.06494-.18164-.13476-.35987-.19092-.54541-.05712-.189-.0996-.38135-.14746-.57325-.04687-.188-.10009-.374-.13818-.56543-.044-.22168-.07031-.44482-.10156-.668-.02344-.165-.05518-.32666-.07129-.49366a12.042,12.042,0,0,1,0-2.373c.01611-.167.04785-.32862.07129-.49366.03125-.22314.05761-.44628.10156-.668.03809-.19141.09131-.37745.13818-.56543.04786-.1919.09034-.38428.14746-.57373.05616-.18506.126-.36329.19092-.54493.0669-.18847.1294-.37793.20606-.56347.06982-.16846.15234-.33008.23-.49463.08887-.19043.17383-.38233.27392-.56885.0835-.15625.1792-.3042.269-.45605.10986-.18457.21484-.3711.335-.55127.11035-.16455.2334-.31934.35156-.478C70.49023,128.70068,70.59814,128.542,70.72168,128.3916ZM236,56V200a20.02229,20.02229,0,0,1-20,20H40a20.02229,20.02229,0,0,1-20-20V56A20.02229,20.02229,0,0,1,40,36H216A20.02229,20.02229,0,0,1,236,56Zm-24,4H44V196H212Z"
              />
            </svg>
          `;
    elm.innerHTML = /* HTML */ `
      <div class="mx-auto flex">
        <div class="relative grow">
          <!-- Input element -->
          <input
            name="${this.#formFieldName}"
            type="text"
            class="w-full rounded-bl-md rounded-tl-md border border-gray-200 px-4 py-2 pr-12 text-lg focus:border-blue-500 focus:outline-none"
            placeholder="${this.#placeholder
              ? this.#placeholder
              : 'Type something...'}"
            autocomplete="off"
          />
          <!-- Arrow Dropwdown -->
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
          >
            ${iconString}
          </div>
          <!-- Div that contains dropdown elements -->
          <div
            id="autocomplete-dropdown"
            class="absolute left-0 top-full z-10 hidden max-h-48 w-full overflow-y-auto rounded-b-md border border-gray-200 bg-white ease-out"
          >
            <!-- Dropdown items will be dynamically inserted here -->
          </div>
        </div>
      </div>
    `;

    // Get input field and dropdown elements
    this.#inputField = elm.querySelector(
      `input[name="${this.#formFieldName}"]`
    )! as HTMLInputElement;
    const dropdown = elm.querySelector(
      '#autocomplete-dropdown'
    )! as HTMLDivElement;

    // Function to show autocomplete dropdown
    const showDropdown = () => {
      this.#inputField.classList.remove('rounded-bl-md');
      dropdown.classList.remove('hidden');
    };

    // Function to hide autocomplete dropdown
    const hideDropdown = () => {
      this.#inputField.classList.add('rounded-tl-md', 'rounded-bl-md');
      dropdown.classList.add('hidden');
    };

    // Function to filter valid values based on input text
    const filterValues = (inputText: string) => {
      return this.#validValues.filter((value) =>
        value.toLowerCase().includes(inputText.toLowerCase())
      );
    };

    // Function to update dropdown with filtered values
    const updateDropdown = (inputText: string) => {
      const filteredValues = filterValues(inputText);
      if (
        this.#currentSelection &&
        !filteredValues.includes(this.#currentSelection.textContent!)
      ) {
        this.#currentSelection.classList.remove('bg-gray-200');
        this.#currentSelection = null;
      }
      dropdown.innerHTML = '';
      filteredValues.forEach((value) => {
        const item = document.createElement('div');
        item.classList.add('px-4', 'py-2', 'cursor-pointer', 'dropdown-item');
        item.textContent = value;
        item.addEventListener('click', () => {
          this.#inputField.value = value;
          updateDropdown(value);
          hideDropdown();
        });
        dropdown.appendChild(item);
      });
      if (filteredValues.length > 0) {
        showDropdown();
      } else {
        hideDropdown();
      }
      if (!this.validate()) {
        this.#inputField.classList.add(
          'focus:border-red-500',
          'border-red-500',
          'border-2'
        );
      } else {
        this.#inputField.classList.remove();
        this.#inputField.classList.remove(
          'focus:border-red-500',
          'border-red-500',
          'border-2'
        );
      }
    };

    this.updateDropdown = () => {
      this.#inputField.focus();
      updateDropdown(this.#inputField.value);
    };

    function isVisible() {
      return !dropdown.classList.contains('hidden');
    }

    // Event listener for input field
    this.#inputField.addEventListener('click', (_) => {
      updateDropdown(this.#inputField.value);
    });

    this.#inputField.addEventListener('input', (event) => {
      const target = event.target! as HTMLInputElement;
      const inputText = target.value;
      updateDropdown(inputText);
    });

    // Event listener for outside click to hide dropdown
    const clickHandler = (event: Event) => {
      if (
        !this.#inputField.contains(event.target! as Node) &&
        !dropdown.contains(event.target! as Node)
      ) {
        hideDropdown();
      }
    };
    document.addEventListener('click', clickHandler);
    this.#documentEventListerners.push({
      event: 'click',
      listener: clickHandler
    });

    const keydownHandler = (event: KeyboardEvent) => {
      if (
        isVisible() &&
        (event.key === 'ArrowDown' || event.key === 'ArrowUp')
      ) {
        const items = dropdown.children;
        if (items.length === 0) return;
        if (!this.#currentSelection) {
          this.#currentSelection = items[0] as HTMLDivElement;
          this.#currentSelection.classList.add('bg-gray-200');
          return;
        }
        let currentIndex = Array.from(items).indexOf(this.#currentSelection);
        console.assert(
          currentIndex !== -1,
          'ERROR: currentSelection not found'
        );
        this.#currentSelection.classList.remove('bg-gray-200');
        if (event.key === 'ArrowDown') {
          currentIndex = (currentIndex + 1) % items.length;
        }
        if (event.key === 'ArrowUp') {
          currentIndex = (currentIndex - 1 + items.length) % items.length;
        }
        this.#currentSelection = items[currentIndex] as HTMLDivElement;
        this.#currentSelection.classList.add('bg-gray-200');
      }
      event.stopPropagation();
    };
    document.addEventListener('keydown', keydownHandler);
    this.#documentEventListerners.push({
      event: 'keydown',
      listener: keydownHandler as EventListener
    });

    dropdown.addEventListener('mousemove', (event) => {
      const target = event.target as HTMLDivElement;
      if (!target.classList.contains('dropdown-item')) return;
      if (this.#currentSelection) {
        this.#currentSelection.classList.remove('bg-gray-200');
      }
      this.#currentSelection = event.target as HTMLDivElement;
      this.#currentSelection.classList.add('bg-gray-200');
      event.stopPropagation();
    });

    const enterHandler = (event: KeyboardEvent) => {
      if (isVisible() && event.key === 'Enter') {
        if (this.#currentSelection) {
          this.#inputField.value = this.#currentSelection.textContent!;
          updateDropdown(this.#inputField.value);
          hideDropdown();
        }
      }
    };

    document.addEventListener('keydown', enterHandler);
    this.#documentEventListerners.push({
      event: 'keydown',
      listener: enterHandler as EventListener
    });

    const printCurrentSelection = () => {
      console.log(this.#currentSelection?.textContent);
    };

    return elm;
  }

  public validate(): boolean {
    return this.#validValues.includes(this.#inputField.value);
  }

  public getSelectedValue(): string {
    return this.#inputField.value;
  }
}
