import Animation from '@/c/base/Animation';
import GSAP from 'gsap';

export default class extends Animation {
  public constructor({ element, delay = 0 }: { element: HTMLElement; delay: number }) {
    super({
      element,
    });
    this.delay = delay;

    this.animateOut();
  }

  public animateIn() {
    GSAP.to(this.element, {
      autoAlpha: 1,
      delay: this.delay,
      ease: Power4.easeOut,
      y: '0%',
      duration: 1.5,
    });
  }

  public animateOut() {
    GSAP.set(this.element, {
      autoAlpha: 0,
      y: '100%',
    });
  }
}
