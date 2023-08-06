import GSAP from 'gsap';
import Animation from '@/c/base/Animation';

export default class extends Animation<HTMLElement, { text?: HTMLSpanElement }> {
  private x: Record<'current' | 'target', number>;
  private y: Record<'current' | 'target', number>;
  // private height: number;
  private frame: number | undefined;

  public constructor({ element }: { element: HTMLElement }) {
    super({
      element,
      elements: element.querySelector('span')
        ? {
            text: element.querySelector('span')!,
          }
        : {},
    });

    this.x = {
      current: 0,
      target: 0,
    };

    this.y = {
      current: 0,
      target: 0,
    };

    this.addEventListener();
  }

  public animateIn() {
    //
  }

  public animateOut() {
    //
  }

  public onResize() {
    // this.height = this.element.clientHeight;
  }

  private onMouseEnter() {
    this.updatePosition();
  }

  private onMouseMove({ clientX, clientY, target }: MouseEvent) {
    if (this.elements.text && target) {
      const { clientHeight, clientWidth } = this.elements.text;

      const { left, top } = (target as HTMLElement)?.getBoundingClientRect();

      const dx = (clientX - left) / clientWidth - 0.5;
      const dy = (clientY - top) / clientHeight - 0.5;

      this.x.target = dx * clientWidth * 0.2;
      this.y.target = dy * clientHeight * 0.2;
    }
  }

  private onMouseLeave() {
    GSAP.to([this.x, this.y], {
      current: 0,
      duration: 0.2,
      onComplete: () => {
        this.frame && window.cancelAnimationFrame(this.frame);
      },
      target: 0,
    });
  }

  public updatePosition() {
    this.x.current = GSAP.utils.interpolate(this.x.current, this.x.target, 0.1);
    this.y.current = GSAP.utils.interpolate(this.y.current, this.y.target, 0.1);

    if (this.elements.text) {
      GSAP.set(this.elements?.text, {
        x: this.x.current,
        y: this.y.current,
      });
    }

    this.frame = window.requestAnimationFrame(this.updatePosition.bind(this));
  }

  public addEventListener() {
    this.element.addEventListener('mouseenter', this.onMouseEnter.bind(this));
    this.element.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
  }

  public removeEventListener() {
    this.element.removeEventListener('mouseenter', this.onMouseEnter.bind(this));
    this.element.removeEventListener('mousemove', this.onMouseMove.bind(this));
    this.element.removeEventListener('mouseleave', this.onMouseLeave.bind(this));
  }
}
