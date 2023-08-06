import AutoBind from 'auto-bind';
import GSAP from 'gsap';
import Prefix from 'prefix';

import Button from '@/c/animations/Button';
import Link from '@/c/animations/Link';
import Magnetic from '@/c/animations/Magnetic';
import Parallax from '@/c/animations/Parallax';
import Paragraph from '@/c/animations/Paragraph';
import Rotation from '@/c/animations/Rotation';
import Translate from '@/c/animations/Translate';

import Detection from '@/c/base/Detection';

import { clamp, lerp } from '@/c/utils/math.util';
import { Scroll } from '@/c/interfaces/animation.interface';
import Animation from './Animation';
import NormalizeWheel from 'normalize-wheel';

const DefaultPageElements = {
  lazyLoaders: '[data-src]',

  animationsButtons: '[data-animation="button"]',
  animationsLinks: '[data-animation="link"]',
  animationsMagnetics: '[data-animation="magnetic"]',
  animationsParallaxes: '[data-animation="parallax"]',
  animationsParagraphs: '[data-animation="paragraph"]',
  animationsRotations: '[data-animation="rotation"]',
  animationsTranslates: '[data-animation="translate"]',

  footer: '.footer',
  footerCredits: '.footer__credits',
} as const;

export default class Page<
  E extends string = string,
  EE extends { wrapper: string; [x: string]: string } = { wrapper: string },
  CC extends { active: string; [x: string]: string } = { active: string },
> {
  protected readonly transformPrefix = Prefix('transform') as 'transform';
  protected classes: CC | undefined;
  protected element: HTMLElement | null;
  protected elements: Record<'wrapper' | keyof EE | keyof typeof DefaultPageElements, HTMLElement[]>;
  protected animations: Animation[] = [];
  protected isVisible = false;
  protected isDown = false;
  private start = 0;

  private isScrollable = true;
  public scroll: Scroll;
  public constructor({
    classes,
    element,
    elements,
    isScrollable = true,
  }: {
    element: E;
    elements: EE;
    classes: CC;
    isScrollable?: boolean;
  }) {
    AutoBind(this);

    this.classes = {
      ...classes,
    };
    this.element = document.querySelector<HTMLElement>(element);

    this.elements = Object.fromEntries(
      Object.entries({ ...DefaultPageElements, ...elements }).map(([key, child]) => {
        return [key, document.querySelectorAll(child) as unknown as HTMLElement[]];
      }),
    ) as Record<'wrapper' | keyof EE | keyof typeof DefaultPageElements, HTMLElement[]>;

    this.isScrollable = isScrollable;

    if (this.isScrollable && this.elements.wrapper?.[0]) {
      this.scroll = {
        ease: 0.07,
        position: 0,
        current: 0,
        target: 0,
        limit: this.elements.wrapper[0].clientHeight - window.innerHeight,
        last: 0,
        clamp: 0,
      };
    } else {
      this.scroll = {
        ease: 0.07,
        position: 0,
        current: 0,
        target: 0,
        limit: 0,
        last: 0,
        clamp: 0,
      };
    }

    this.createAnimations();
    this.createResizeObserver();
    this.createLazyLoaders();
  }

  /**
   * Animations.
   */
  private createAnimations() {
    /**
     * Buttons.
     */
    const animationsButtons = this.elements.animationsButtons.map((element) => {
      return new Button({
        element,
      });
    });

    this.animations.push(...animationsButtons);

    /**
     * Links.
     */
    const animationsLinks = this.elements.animationsLinks.map((element) => {
      return new Link({
        element,
      });
    });

    this.animations.push(...animationsLinks);

    /**
     * Magnetics.
     */
    const animationsMagnetics = this.elements.animationsMagnetics.map((element) => {
      return new Magnetic({
        element,
      });
    });

    this.animations.push(...animationsMagnetics);

    /**
     * Parallaxes.
     */
    const animationsParallaxes = this.elements.animationsParallaxes.map((element) => {
      return new Parallax({ element });
    });

    this.animations.push(...animationsParallaxes);

    /**
     * Paragraphs.
     */
    const animationsParagraphs = this.elements.animationsParagraphs.map((element) => {
      return new Paragraph({ element });
    });

    this.animations.push(...animationsParagraphs);

    /**
     * Rotations.
     */
    const animationsRotations = this.elements.animationsRotations.map((element) => {
      return new Rotation({ element });
    });

    this.animations.push(...animationsRotations);

    /**
     * Translates.
     */
    const animationsTranslates = this.elements.animationsTranslates.map((element) => {
      return new Translate({ element });
    });

    this.animations.push(...animationsTranslates);
  }

  /**
   * Observer.
   */
  private createResizeObserver() {
    if (!this.elements.wrapper[0]) return;
    const resizeObserver = new window.ResizeObserver((entries) => {
      entries.forEach(() => {
        window.requestAnimationFrame(() => {
          this.scroll.limit = this.elements.wrapper[0].clientHeight - window.innerHeight;
        });
      });
    });

    resizeObserver.observe(this.elements.wrapper[0]);
  }

  /**
   * Footer.
   */
  private createLazyLoaders() {
    this.elements.lazyLoaders.forEach((element) => {
      const intersectionObserver = new window.IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (this.element && !(this.element as HTMLElement & { src: string | null })?.src) {
              (this.element as HTMLElement & { src: string | null }).src = this.element.getAttribute('data-src');
              this.element.onload = () => {
                this.element?.classList.add('loaded');
              };
            }
          }
        });
      });
      intersectionObserver.observe(element);
    });
  }

  /**
   * Animations.
   */
  private reset() {
    this.scroll = {
      ease: 0.07,
      position: 0,
      current: 0,
      target: 0,
      limit: 0,
      last: 0,
      clamp: 0,
    };
  }

  protected set(value: number) {
    if (!this.elements.wrapper[0]) return;

    this.scroll.current = this.scroll.target = this.scroll.last = value;

    this.transform(this.elements.wrapper[0], this.scroll.current);
  }

  public show() {
    if (this.element) {
      this.reset();

      this.isVisible = true;

      this.addEventListeners();

      GSAP.set(document.documentElement, {
        backgroundColor: this.element.getAttribute('data-background') || 'transparent',
        color: this.element.getAttribute('data-color') || 'transparent',
      });
    }
  }

  public hide() {
    this.isVisible = false;

    this.removeEventListeners();
  }

  private transform(element: HTMLElement, y: number) {
    element.style[this.transformPrefix] = `translate3d(0, ${-Math.round(y)}px, 0)`;
  }

  /**
   * Events.
   */
  public onResize() {
    if (!this.elements.wrapper[0]) return;

    window.requestAnimationFrame(() => {
      this.scroll.limit = this.elements.wrapper[0].clientHeight - window.innerHeight;

      this.animations.forEach((animation) => {
        animation.onResize();
      });
    });
  }

  onTouchDown(event: TouchEvent | MouseEvent) {
    if (!Detection.isPhone()) return;

    this.isDown = true;

    this.scroll.position = this.scroll.current;
    this.start = (event as TouchEvent).touches
      ? (event as TouchEvent).touches[0].clientY
      : (event as MouseEvent).clientY;
  }

  onTouchMove(event: TouchEvent | MouseEvent) {
    if (!Detection.isPhone() || !this.isDown) return;

    const y = (event as TouchEvent).touches ? (event as TouchEvent).touches[0].clientY : (event as MouseEvent).clientY;
    const distance = (this.start - y) * 3;

    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp() {
    if (!Detection.isPhone()) return;

    this.isDown = false;
  }

  public onWheel(normalized: ReturnType<typeof NormalizeWheel>) {
    const speed = normalized.pixelY;

    this.scroll.target += speed;

    return speed;
  }

  /**
   * Listeners.
   */
  public addEventListeners() {
    //
  }

  public removeEventListeners() {
    //
  }

  /**
   * Frames.
   */
  public update() {
    if (!this.elements.wrapper[0]) return;
    this.scroll.target = clamp(0, this.scroll.limit, this.scroll.target);

    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    this.scroll.current = Math.floor(this.scroll.current);

    if (this.scroll.current < 0.1) {
      this.scroll.current = 0;
    }

    if (this.elements.wrapper) {
      this.transform(this.elements.wrapper[0], this.scroll.current);
    }

    this.animations.forEach((animation) => {
      animation.update(this.scroll);
    });

    this.scroll.last = this.scroll.current;
  }
}
