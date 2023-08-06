import Animation from '@/c/base/Animation';
import { Scroll } from '@/c/interfaces/animation.interface';

export default class extends Animation {
  public constructor({ element }: { element: HTMLElement }) {
    super({
      element,
    });
  }

  public update(scroll: Scroll) {
    this.element.style[this.transformPrefix] = `rotate(${scroll.current * 0.25}deg)`;
  }
}
