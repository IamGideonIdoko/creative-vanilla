import Animation from '@/c/base/Animation';
import { easing } from '@/c/utils/dom.util';

export default class extends Animation {
  public constructor({ element }: { element: HTMLElement }) {
    super({ element });
  }

  public animateIn() {
    super.animateIn();

    this.element.style.transition = `transform 1.5s ${easing}`;
    this.element.style[this.transformPrefix] = `translateY(0)`;
  }

  public animateOut() {
    super.animateOut();

    this.element.style[this.transformPrefix] = `translateY(100%)`;
  }
}
