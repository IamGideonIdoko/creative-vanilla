import { calculate, split } from '@/c/utils/text.util';
import Animation from '@/c/base/Animation';
import GSAP from 'gsap';

export default class extends Animation<HTMLElement, { spans?: NodeListOf<HTMLSpanElement> }> {
  public constructor({
    element,
    delay = 0,
    append = false,
  }: {
    element: HTMLElement;
    delay?: number;
    append?: boolean;
  }) {
    super({
      element,
    });
    this.delay = delay;
    this.element = element;

    split({
      element,
      expression: ' ',
      append,
    });

    split({
      element,
      append,
      expression: ' ',
    });

    this.elements.spans = element.querySelectorAll<HTMLSpanElement>('span span');

    this.animateOut();
  }

  public animateIn() {
    if (this.elements.spans) {
      GSAP.to(calculate(this.elements.spans), {
        autoAlpha: 1,
        delay: this.delay,
        ease: Power4.easeOut,
        y: '0%',
        duration: 1.5,
        stagger: 0.1,
      });
    }
  }

  public animateOut() {
    if (this.elements.spans) {
      GSAP.set(this.elements.spans, {
        autoAlpha: 0,
        y: '100%',
      });
    }
  }
}
