import NormalizeWheel from 'normalize-wheel';
import Animation from '@/c/base/Animation';
import { getOffset } from '@/c/utils/dom.util';
import { lerp } from '@/c/utils/math.util';
import { split } from '@/c/utils/text.util';
import type { MarqueeItem, MarqueeScroll } from '@/c/interfaces/animation.interface';

export default class extends Animation<HTMLElement, { items: HTMLSpanElement[] | NodeListOf<HTMLSpanElement> }> {
  private index: number;
  private scroll: MarqueeScroll;
  private width: number;
  private widthTotal: number;
  private isEnabled = false;
  private direction: 'up' | 'down' = 'down';

  public constructor({ element, index }: { element: HTMLElement; index: number }) {
    super({
      element,
    });

    split({
      element,
      expression: ' ',
      append: true,
    });

    this.elements.items = element.querySelectorAll<HTMLSpanElement>('span span');

    this.index = index;

    this.scroll = {
      ease: 0.1,
      position: 0,
      current: 0,
      speed: this.index % 2 === 0 ? 2 : -2,
      target: 0,
      last: 0,
    };

    this.elements.items.forEach((element: MarqueeItem) => {
      const offset = getOffset(element);

      element.extra = 0;
      element.width = offset.width;
      element.offset = offset.left;
      element.position = 0;
    });

    this.width = (this.elements.items[0] as MarqueeItem).width || 0;
    this.widthTotal = this.element.getBoundingClientRect().width;
  }

  public enable() {
    this.isEnabled = true;

    this.update();
  }

  public disable() {
    this.isEnabled = false;
  }

  public onWheel(event: WheelEvent) {
    if (!this.isEnabled) return;

    const normalized = NormalizeWheel(event);
    const speed = normalized.pixelY * 0.5;

    let speedValue = this.index % 2 === 0 ? 2 : -2;

    if (speed < 0) {
      speedValue *= -1;
    }

    this.scroll.speed = speedValue;
    this.scroll.target += speedValue;
  }

  private transform(element: HTMLSpanElement, x: number) {
    element.style[this.transformPrefix] = `translate3d(${Math.floor(x)}px, 0, 0)`;
  }

  public update() {
    if (!this.isEnabled) return;

    this.scroll.target += this.scroll.speed;

    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);

    if (this.scroll.current < this.scroll.last) {
      this.direction = 'down';
    } else {
      this.direction = 'up';
    }

    this.elements.items.forEach((item: MarqueeItem) => {
      item.position = -this.scroll.current - (item.extra || 0);

      const offset = item.position + (item.offset || 0) + (item.width || 0);

      item.isBefore = offset < 0;
      item.isAfter = offset > this.widthTotal;

      if (this.direction === 'up' && item.isBefore) {
        item.extra = (item.extra || 0) - this.widthTotal;

        item.isBefore = false;
        item.isAfter = false;
      }

      if (this.direction === 'down' && item.isAfter) {
        item.extra = (item.extra || 0) + this.widthTotal;

        item.isBefore = false;
        item.isAfter = false;
      }

      this.transform(item, item.position);
    });

    this.scroll.last = this.scroll.current;
  }

  public onResize() {
    this.elements.items.forEach((item: MarqueeItem) => {
      this.transform(item, 0);

      const offset = getOffset(item);

      item.extra = 0;
      item.width = offset.width;
      item.offset = offset.left;
      item.position = 0;
    });

    this.width = this.elements.items[0].getBoundingClientRect().width;
    this.widthTotal = this.element.getBoundingClientRect().width;

    this.scroll = {
      ease: 0.1,
      position: 0,
      current: 0,
      speed: this.index % 2 === 0 ? 2 : -2,
      target: 0,
      last: 0,
    };
  }
}
