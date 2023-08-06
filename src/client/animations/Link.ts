import GSAP from 'gsap';
import Animation from '@/c/base/Animation';
import { CSS as ease } from '@/c/utils/easings.util';
import { split } from '@/c/utils/text.util';

export default class extends Animation<
  HTMLElement,
  {
    text?: HTMLDivElement;
    textSpans?: NodeListOf<HTMLSpanElement>;
    hover?: HTMLDivElement;
    hoverSpans?: NodeListOf<HTMLSpanElement>;
  }
> {
  private timeline = GSAP.timeline({ paused: true });
  constructor({ element }: { element: HTMLElement }) {
    super({
      element,
      elements: {
        text: document.createElement('div'),
        hover: document.createElement('div'),
      },
    });

    const innerHTML = this.element.querySelector('span')?.innerHTML || '';

    if (this.elements.text) {
      this.elements.text.innerHTML = innerHTML;
      this.elements.textSpans = split({
        append: false,
        element: this.elements.text,
        expression: '',
      });
    }

    if (this.elements.hover) {
      this.elements.hover.innerHTML = innerHTML;
      this.elements.hoverSpans = split({
        append: false,
        element: this.elements.hover,
        expression: '',
      });
    }

    this.element.innerHTML = '';
    this.elements.text && this.element.appendChild(this.elements.text);
    this.elements.hover && this.element.appendChild(this.elements.hover);

    if (this.elements.hover) {
      if (this.element.getAttribute('data-animation-position') === 'center') {
        GSAP.set(this.elements.hover, {
          left: '50%',
          position: 'absolute',
          top: '50%',
          x: '-50%',
          y: '-50%',
        });
      } else {
        GSAP.set(this.elements.hover, {
          left: 0,
          position: 'absolute',
          top: 0,
        });
      }
    }

    if (this.elements.textSpans) {
      this.timeline.to(
        this.elements.textSpans,
        {
          duration: 0.5,
          ease,
          transform: 'rotate3d(1, 0.2, 0, -90deg)',
          stagger: 0.02,
        },
        0,
      );
    }

    if (this.elements.hoverSpans) {
      this.timeline.fromTo(
        this.elements.hoverSpans,
        {
          transform: 'rotate3d(1, 0.2, 0, 90deg)',
        },
        {
          duration: 0.5,
          ease,
          transform: 'rotate3d(0, 0, 0, 90deg)',
          stagger: 0.02,
        },
        0.05,
      );
    }

    this.animateOut();
    this.addEventListener();
  }

  public animateIn() {
    //
  }

  public animateOut() {
    //
  }

  private onMouseEnter() {
    this.timeline.play();
  }

  private onMouseLeave() {
    this.timeline.reverse();
  }

  public addEventListener() {
    this.element.addEventListener('mouseenter', this.onMouseEnter.bind(this));
    this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
  }

  public removeEventListener() {
    this.element.addEventListener('mouseenter', this.onMouseEnter.bind(this));
    this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
  }
}
