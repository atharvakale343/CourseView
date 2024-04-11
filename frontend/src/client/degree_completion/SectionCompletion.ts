import { Section } from '../../lib/types/Degree';
import { guidGenerator } from '../../lib/utils';
import { SubsectionCompletion } from './SubsectionCompletion';
import { CardsViewList } from './cards/Cards';

export class SectionCompletion {
  section: Section;
  constructor(section: Section) {
    this.section = section;
  }
  public render(): HTMLDivElement {
    const elm = document.createElement('div');

    elm.innerHTML = /* HTML */ `
      <h1>${this.section.title}</h1>
      <h2>${this.section.description}</h2>
      <div class="subsections flex flex-col gap-y-8 mt-4"></div>
    `;

    elm.querySelector('.subsections')!.append(
      ...this.section.subsections.map((subsection) => {
        return new SubsectionCompletion(subsection).render();
      })
    );
    return elm;
  }
}
