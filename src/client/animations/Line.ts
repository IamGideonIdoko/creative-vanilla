import Animation from '@/c/base/Animation';

export default class extends Animation {
  public constructor({ element }: { element: HTMLElement }) {
    super({ element });
  }

  public animateIn() {
    super.animateIn();

    this.element.style[this.transformPrefix] = `scaleX(1)`;
  }

  public animateOut() {
    super.animateOut();

    this.element.style[this.transformPrefix] = `scaleX(0)`;
  }
}
