import { Section } from '../../lib/types/Degree';
import { SubsectionCompletion } from './SubsectionCompletion';

export class SectionCompletion {
  section: Section;
  constructor(section: Section) {
    this.section = section;
  }
  public render(): HTMLDivElement {
    const elm = document.createElement('div');

    elm.innerHTML = /* HTML */ `
      <button
        class="dropdown-btn w-full rounded-md bg-slate-50 p-4 text-left shadow-md hover:bg-slate-200"
      >
        <div class="flex flex-row">
          <div class="flex grow flex-col">
            <h1 class="text-xl md:text-2xl font-bold">${this.section.title}</h1>
            <h2 class="mt-1 text-sm italic lg:text-base">
              ${this.section.description}
            </h2>
          </div>
          <div class="flex items-center text-3xl">
            <i class="fa fa-caret-right hidden" aria-hidden="true"></i>
            <i class="fa fa-caret-down" aria-hidden="true"></i>
          </div>
        </div>
      </button>
      <div class="subsections mt-4 flex flex-col gap-y-16"></div>
    `;

    const subsections = elm.querySelector('.subsections')! as HTMLDivElement;
    subsections.append(
      ...this.section.subsections.map((subsection) => {
        return new SubsectionCompletion(subsection).render();
      })
    );

    const faCaretRight = elm.querySelector('.fa-caret-right')!;
    const faCaretDown = elm.querySelector('.fa-caret-down')!;

    elm.querySelector('.dropdown-btn')!.addEventListener('click', () => {
      if (faCaretRight.classList.contains('hidden')) {
        faCaretRight.classList.remove('hidden');
        faCaretDown.classList.add('hidden');
        subsections.style.display = 'none';
      } else {
        faCaretRight.classList.add('hidden');
        faCaretDown.classList.remove('hidden');
        subsections.style.display = 'flex';
      }
    });
    return elm;
  }
}
