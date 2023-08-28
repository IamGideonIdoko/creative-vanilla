import GSAP from 'gsap';
import Animation from '@/c/base/Animation';
import { DEFAULT as ease } from '@/c/utils/easings.util';
import { split } from '@/c/utils/text.util';

export default class extends Animation<
  HTMLElement,
  {
    wrapper?: HTMLSpanElement;
    text?: HTMLDivElement;
    textSpans?: NodeListOf<HTMLSpanElement>;
    hover?: HTMLDivElement;
    hoverSpans?: NodeListOf<HTMLSpanElement>;
  }
> {
  private timeline = GSAP.timeline({ paused: true });
  private path?: SVGPathElement | null;
  private pathLength = 0;
  private pathValue = 0;
  public constructor({ element }: { element: HTMLElement }) {
    super({
      element,
    });

    this.createText();
    this.createPath();
  }

  private createText() {
    const text = this.element.textContent;

    this.elements.wrapper = this.element.querySelector('span')!;

    this.elements.text = document.createElement('div');
    this.elements.text.innerHTML = text || '';
    this.elements.textSpans = split({
      append: false,
      element: this.elements.text,
      expression: '',
    })!;

    this.elements.hover = document.createElement('div');
    this.elements.hover.innerHTML = text || '';
    this.elements.hoverSpans = split({
      append: false,
      element: this.elements.hover,
      expression: '',
    });

    this.elements.wrapper.innerHTML = '';
    this.elements.wrapper.appendChild(this.elements.text);
    this.elements.wrapper.appendChild(this.elements.hover);

    GSAP.set(this.elements.hover, {
      left: 0,
      position: 'absolute',
      top: 0,
    });

    this.timeline.to(
      this.elements.textSpans,
      {
        duration: 0.5,
        ease,
        transform: 'rotate3d(1, 0.1, 0, -90deg)',
        stagger: 0.01,
      },
      0,
    );

    this.timeline.fromTo(
      this.elements.hoverSpans,
      {
        transform: 'rotate3d(1, 0.1, 0, 90deg)',
      },
      {
        duration: 0.5,
        ease,
        transform: 'rotate3d(0, 0, 0, 90deg)',
        stagger: 0.01,
      },
      0.05,
    );
  }

  private createPath() {
    this.path = this.element.querySelector<SVGPathElement>('path:last-child');
    this.pathLength = this.path?.getTotalLength() || 0;
    this.pathValue = this.pathLength;

    GSAP.set(this.path, {
      strokeDashoffset: this.pathLength,
      strokeDasharray: `${this.pathLength} ${this.pathLength}`,
    });
  }

  private onMouseEnter() {
    this.pathValue -= this.pathLength;

    if (this.path) {
      GSAP.to(this.path, {
        duration: 1,
        ease,
        strokeDashoffset: this.pathValue,
      });
    }

    this.timeline.play();
  }

  private onMouseLeave() {
    this.pathValue -= this.pathLength;

    if (this.path) {
      GSAP.to(this.path, {
        duration: 1,
        ease,
        strokeDashoffset: this.pathValue,
      });
    }

    this.timeline.reverse();
  }

  public addEventListeners() {
    this.element.addEventListener('mouseenter', this.onMouseEnter.bind(this));
    this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
  }

  public removeEventListeners() {
    this.element.removeEventListener('mouseenter', this.onMouseEnter.bind(this));
    this.element.removeEventListener('mouseleave', this.onMouseLeave.bind(this));
  }
}
