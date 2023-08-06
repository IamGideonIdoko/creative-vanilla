import NormalizeWheel from 'normalize-wheel';
import Animation from '@/c/base/Animation';
import { getOffset } from '@/c/utils/dom.util';
import { lerp } from '@/c/utils/math.util';
import { Scroll, ScrollingItem } from '@/c/interfaces/animation.interface';

export default class extends Animation<HTMLElement, { list: HTMLUListElement; items: HTMLLIElement[] }> {
  private scroll: Scroll;
  private listHeight: number;
  private isEnabled = false;
  private isDown = false;
  private start = 0;
  private direction: 'up' | 'down' = 'down';

  public constructor({
    element,
    elements,
  }: {
    element: HTMLElement;
    elements: { list: HTMLUListElement; items: HTMLLIElement[] };
  }) {
    super({
      element,
      elements,
    });

    this.scroll = {
      ease: 0.1,
      position: 0,
      current: 0,
      target: 0,
      last: 0,
      clamp: 0,
      limit: 0,
    };

    this.elements.items.forEach((item: ScrollingItem) => {
      const offset = getOffset(item);

      item.extra = 0;
      item.height = offset.height;
      item.offset = offset.top;
      item.position = 0;
    });

    this.listHeight = this.elements.list.getBoundingClientRect().height;
  }

  public enable() {
    this.isEnabled = true;

    this.update();
  }

  public disable() {
    this.isEnabled = false;
  }

  public onTouchDown(event: MouseEvent | TouchEvent) {
    if (!this.isEnabled) return;

    this.isDown = true;

    this.scroll.position = this.scroll.current;
    this.start = (event as TouchEvent).touches
      ? (event as TouchEvent).touches[0].clientY
      : (event as MouseEvent).clientY;
  }

  public onTouchMove(event: MouseEvent | TouchEvent) {
    if (!this.isDown || !this.isEnabled) return;

    const y = (event as TouchEvent).touches ? (event as TouchEvent).touches[0].clientY : (event as MouseEvent).clientY;
    const distance = (this.start - y) * 2;

    this.scroll.target = this.scroll.position + distance;
  }

  public onTouchUp() {
    if (!this.isEnabled) return;

    this.isDown = false;
  }

  public onWheel(event: WheelEvent) {
    if (!this.isEnabled) return;

    const normalized = NormalizeWheel(event);
    const speed = normalized.pixelY * 0.5;

    this.scroll.target += speed;
  }

  public transform(element: HTMLElement, y: number) {
    element.style[this.transformPrefix] = `translate3d(0, ${Math.floor(y)}px, 0)`;
  }

  public update() {
    if (!this.isEnabled) return;

    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);

    const scrollClamp = Math.round(this.scroll.current % this.listHeight);

    if (this.scroll.current < this.scroll.last) {
      this.direction = 'down';
    } else {
      this.direction = 'up';
    }

    this.elements.items.forEach((item: ScrollingItem) => {
      item.position = -this.scroll.current - (item.extra || 0);

      const offset = item.position + (item.offset || 0) + (item.height || 0);

      item.isBefore = offset < 0;
      item.isAfter = offset > this.listHeight;

      if (this.direction === 'up' && item.isBefore) {
        item.extra = (item.extra || 0) - this.listHeight;

        item.isBefore = false;
        item.isAfter = false;
      }

      if (this.direction === 'down' && item.isAfter) {
        item.extra = (item.extra || 0) + this.listHeight;

        item.isBefore = false;
        item.isAfter = false;
      }

      item.clamp = (item.extra || 0) % scrollClamp;

      this.transform(item, item.position);
    });

    this.scroll.last = this.scroll.current;
    this.scroll.clamp = scrollClamp;
  }

  public onResize() {
    this.elements.items.forEach((item: ScrollingItem) => {
      this.transform(item, 0);

      const offset = getOffset(item);

      item.extra = 0;
      item.height = offset.height;
      item.offset = offset.top;
      item.position = 0;
    });

    this.listHeight = this.elements.list.getBoundingClientRect().height;

    this.scroll = {
      ease: 0.1,
      position: 0,
      current: 0,
      target: 0,
      last: 0,
      limit: 0,
      clamp: 0,
    };
  }
}
