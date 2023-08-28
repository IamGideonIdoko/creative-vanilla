import { BREAKPOINT_TABLET } from '@/c/utils/breakpoints.util';
import { getOffset } from '@/c/utils/dom.util';
import { clamp, map } from '@/c/utils/math.util';
import Animation from '@/c/base/Animation';
import { Scroll } from '@/c/interfaces/animation.interface';

export default class extends Animation<HTMLElement, { media?: HTMLImageElement }> {
  private parallax: number;
  private scale: number;
  private amount = 0;
  private offset?: ReturnType<typeof getOffset>;

  public constructor({ element }: { element: HTMLElement }) {
    super({
      element,
      elements: element.querySelector('img')
        ? {
            media: element.querySelector('img')!,
          }
        : {},
    });

    if (this.elements.media) {
      this.elements.media.onload = () => {
        this.onResize();
      };
    }

    this.amount = window.innerWidth < BREAKPOINT_TABLET ? 10 : 150;

    this.parallax = -this.amount;

    this.scale = 1.15;
    this.onResize();
  }

  public onResize() {
    this.amount = window.innerWidth < BREAKPOINT_TABLET ? 10 : 150;
    this.offset = getOffset(this.element);
  }

  public update(scroll: Scroll) {
    if (!this.offset) {
      return;
    }

    const { innerHeight } = window;

    const offsetBottom = scroll.current + innerHeight;

    if (offsetBottom >= this.offset.top) {
      this.parallax = clamp(
        -this.amount,
        this.amount,
        map(this.offset.top - scroll.current, -this.offset.height, innerHeight, this.amount, -this.amount),
      );
      this.scale = clamp(1, 1.15, map(this.offset.top - scroll.current, -this.offset.height, innerHeight, 1, 1.15));

      if (this.elements.media) {
        this.elements.media.style[this.transformPrefix] = `translate3d(0, ${this.parallax}px, 0) scale(${this.scale})`;
      }
    } else {
      if (this.elements.media) {
        this.elements.media.style[this.transformPrefix] = `translate3d(0, -${this.amount}px, 0) scale(1.15)`;
      }
    }
  }
}
