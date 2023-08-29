import GSAP from 'gsap';
import Component from '@/c/base/Component';
import { DEFAULT as ease } from '@/c/utils/easings.util';
import { split } from '@/c/utils/text.util';

declare global {
  interface Window {
    ASSETS: string[];
  }
}

export default class extends Component {
  private titleSpans: NodeListOf<HTMLSpanElement>;
  private length: number;
  private animateIn?: ReturnType<typeof GSAP.timeline>;
  private animateOut?: ReturnType<typeof GSAP.timeline>;
  public constructor() {
    super({
      element: '.preloader',
      elements: {
        title: '.preloader__text',
        number: '.preloader__number',
        numberText: '.preloader__number__text',
      },
    });

    this.titleSpans = split({
      append: true,
      element: this.elements.title[0],
      expression: '<br>',
    });

    this.titleSpans.forEach((element) => {
      split({
        append: false,
        element,
        expression: '',
      });
    });

    this.length = 0;
    this.createLoader();
  }

  private createLoader() {
    this.animateIn = GSAP.timeline();

    this.animateIn.set(this.elements.title, {
      autoAlpha: 1,
    });

    this.titleSpans.forEach((line, index) => {
      const letters = line.querySelectorAll('span');

      const onStart = () => {
        GSAP.fromTo(
          letters,
          {
            autoAlpha: 0,
            display: 'inline-block',
            y: '100%',
          },
          {
            autoAlpha: 1,
            delay: 0.2,
            display: 'inline-block',
            duration: 1,
            ease: 'back.inOut',
            stagger: 0.015,
            y: '0%',
          },
        );
      };

      this.animateIn?.fromTo(
        line,
        {
          autoAlpha: 0,
          y: '100%',
        },
        {
          autoAlpha: 1,
          delay: 0.2 * index,
          duration: 1.5,
          onStart,
          ease: 'expo.inOut',
          y: '0%',
        },
        'start',
      );
    });
  }

  public onAssetLoaded() {
    this.length += 1;

    const percent = this.length / window.ASSETS.length;

    if (this.elements.numberText[0]) {
      this.elements.numberText[0].innerHTML = `${Math.round(percent * 100)}%`;
    }

    if (percent === 1) {
      this.onLoaded();
    }
  }

  public onLoaded() {
    return new Promise(() => {
      this.animateOut = GSAP.timeline({
        delay: 1,
      });

      this.titleSpans.forEach((line, index) => {
        const letters = line.querySelectorAll('span');

        const onStart = () => {
          GSAP.to(letters, {
            autoAlpha: 0,
            delay: 0.2,
            display: 'inline-block',
            duration: 1,
            ease: 'back.inOut',
            stagger: 0.015,
            y: '-100%',
          });
        };

        this.animateOut?.to(
          line,
          {
            autoAlpha: 0,
            delay: 0.2 * index,
            duration: 1.5,
            onStart,
            ease: 'expo.inOut',
            y: '-100%',
          },
          'start',
        );
      });

      this.animateOut.to(
        this.elements.numberText[0],
        {
          autoAlpha: 0,
          duration: 1,
          ease,
        },
        'start',
      );

      this.animateOut.to(this.element, {
        autoAlpha: 0,
        duration: 1,
      });

      this.animateOut.call(() => {
        this.destroy();
      });
    });
  }

  public destroy() {
    if (!this.element?.parentNode) return;
    this.element.parentNode.removeChild(this.element);
  }
}
