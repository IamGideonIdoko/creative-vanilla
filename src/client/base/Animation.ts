import AutoBind from 'auto-bind';
import type { IAnimation, Scroll } from '@/c/interfaces/animation.interface';
import Prefix from 'prefix';

export default class Animation<
  E extends HTMLElement = HTMLElement,
  EE extends Record<string, HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>> = Record<
    string,
    HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>
  >,
> implements IAnimation
{
  protected isVisible = false;
  protected delay = 0;
  protected element: E;
  protected elements: EE;
  protected target: HTMLElement;
  private observer: IntersectionObserver | undefined;
  protected readonly transformPrefix = Prefix('transform') as 'transform';

  constructor({ element, elements }: { element: E; elements?: EE }) {
    AutoBind(this);

    const { animationDelay, animationTarget } = element.dataset;

    this.delay = Number(animationDelay) || 0;

    this.element = element;
    this.elements = elements || ({} as EE);

    this.target = animationTarget ? element.closest(animationTarget) || element : element;

    if ('IntersectionObserver' in window) {
      this.createObserver();

      this.animateOut();
    } else {
      this.animateIn();
    }
  }

  private createObserver() {
    this.observer = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!this.isVisible && entry.isIntersecting) {
          this.animateIn();
        } else {
          this.animateOut();
        }
      });
    });

    this.observer.observe(this.target);
  }

  protected animateIn() {
    this.isVisible = true;
  }

  protected animateOut() {
    this.isVisible = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(scroll: Scroll) {
    //
  }

  public onResize() {
    //
  }
}
