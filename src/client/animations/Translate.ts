import { BREAKPOINT_TABLET } from '@/c/utils/breakpoints.util';
import { getOffset } from '@/c/utils/dom.util';
import { map } from '@/c/utils/math.util';
import Animation from '@/c/base/Animation';
import { Scroll } from '@/c/interfaces/animation.interface';

export default class extends Animation {
  private amount = 0;
  private parallax = 0;
  private direction: 'left' | 'right' = 'left';
  private offset: ReturnType<typeof getOffset> | undefined;

  public constructor({ element }: { element: HTMLElement }) {
    super({
      element,
    });

    this.element = element;

    this.direction = (this.element.getAttribute('data-animation-direction') as typeof this.direction) || 'left';

    this.isVisible = false;
    this.onResize();
    this.parallax = -this.amount;
  }

  onResize() {
    this.amount = window.innerWidth < BREAKPOINT_TABLET ? 10 : 150;
    this.offset = getOffset(this.target);
  }

  update(scroll: Scroll) {
    const { innerHeight } = window;

    const offsetBottom = scroll.current + innerHeight;

    if (offsetBottom >= (this.offset?.top || 0)) {
      this.parallax = map(
        (this.offset?.top || 0) - scroll.current,
        -(this.offset?.height || 0),
        innerHeight,
        this.amount,
        -this.amount,
      );

      if (this.direction === 'left') {
        this.parallax *= -1;
        this.parallax = Math.min(this.parallax, 0);
      } else {
        this.parallax = Math.max(this.parallax, 0);
      }

      this.element.style[this.transformPrefix] = `translate3d(0, ${this.parallax}px, 0)`;
    } else {
      this.element.style[this.transformPrefix] = `translate3d(0, ${this.amount}px, 0)`;
    }
  }
}
