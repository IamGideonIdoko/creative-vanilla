import Animation from '@/c/base/Animation';
import { CSS } from '@/c/utils/easings.util';
import { calculate, split } from '@/c/utils/text.util';

export default class extends Animation<HTMLElement, { lines: HTMLSpanElement[] }> {
  private lines: HTMLSpanElement[][] = [];
  public constructor({ element }: { element: HTMLElement }) {
    const lines: HTMLSpanElement[] = [];
    const paragraphs = element.querySelectorAll<HTMLHeadingElement | HTMLParagraphElement>('h1, h2, p');

    if (paragraphs.length !== 0) {
      paragraphs.forEach((element) => {
        split({ element });
        split({ element });

        lines.push(...(element.querySelectorAll<HTMLSpanElement>('span span') as unknown as HTMLSpanElement[]));
      });
    } else {
      split({ element });
      split({ element });

      lines.push(...(element.querySelectorAll<HTMLSpanElement>('span span') as unknown as HTMLSpanElement[]));
    }

    super({
      element,
      elements: {
        lines,
      },
    });

    this.onResize();

    if ('IntersectionObserver' in window) {
      this.animateOut();
    }
  }

  public animateIn() {
    super.animateIn();
    this.lines.forEach((line, lineIndex) => {
      line.forEach((word) => {
        word.style.transition = `transform 1.5s ${lineIndex * 0.1}s ${CSS}`;
        word.style[this.transformPrefix] = 'translateY(0)';
      });
    });
  }

  public animateOut() {
    super.animateOut();

    this.lines.forEach((line) => {
      line.forEach((word) => {
        word.style[this.transformPrefix] = 'translateY(100%)';
      });
    });
  }

  public onResize() {
    this.lines = calculate(this.elements.lines);
  }
}
