import Component from '@/c/base/Component';
import { getOffset } from '@/c/utils/dom.util';
import { lerp } from '@/c/utils/math.util';
import type { Scroll } from '@/c/interfaces/animation.interface';
import NormalizeWheel from 'normalize-wheel';

export default class extends Component<
  string,
  Record<'items' | 'list', string>,
  HTMLElement,
  {
    items: (HTMLElement &
      Record<'extra' | 'height' | 'offset' | 'position' | 'clamp', number> &
      Record<'isBefore' | 'isAfter', boolean>)[];
    list: HTMLUListElement[];
  }
> {
  private speed: number;
  private scroll: Omit<Scroll, 'limit'>;
  private isEnabled = false;
  private listHeight = 0;
  private isDown = false;
  private start = 0;
  private direction: 'up' | 'down' = 'down';

  public constructor({
    element,
    elements,
  }: ConstructorParameters<typeof Component<string, Record<'items' | 'list', string>>>[0]) {
    super({
      element,
      elements,
    });

    this.speed = 2;
    this.scroll = {
      ease: 0.1,
      position: 0,
      current: 0,
      target: 0,
      last: 0,
      clamp: 0,
    };

    if (this.elements) {
      this.elements.items.forEach((element) => {
        const offset = getOffset(element);
        element.extra = 0;
        element.height = offset.height;
        element.offset = offset.top;
        element.position = 0;
      });
      this.listHeight = this.elements.list[0].getBoundingClientRect().height;
    }
  }

  enable() {
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

    this.speed = speed > 0 ? 2 : -2;
  }

  private transform(element: HTMLElement, y: number) {
    element.style[this.transformPrefix] = `translate3d(0, ${Math.floor(y)}px, 0)`;
  }

  public update() {
    if (!this.isEnabled) return;

    this.scroll.target += this.speed;
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);

    const scrollClamp = Math.round(this.scroll.current % this.listHeight);

    if (this.scroll.current < this.scroll.last) {
      this.direction = 'down';
    } else {
      this.direction = 'up';
    }

    this.elements?.items.forEach((element) => {
      element.position = -this.scroll.current - element.extra;

      const offset = element.position + element.offset + element.height;

      element.isBefore = offset < 0;
      element.isAfter = offset > this.listHeight;

      if (this.direction === 'up' && element.isBefore) {
        element.extra = element.extra - this.listHeight;

        element.isBefore = false;
        element.isAfter = false;
      }

      if (this.direction === 'down' && element.isAfter) {
        element.extra = element.extra + this.listHeight;

        element.isBefore = false;
        element.isAfter = false;
      }

      element.clamp = element.extra % scrollClamp;

      this.transform(element, element.position);
    });

    this.scroll.last = this.scroll.current;
    this.scroll.clamp = scrollClamp;
  }

  onResize() {
    if (!this.elements) return;
    this.elements.items.forEach((element) => {
      this.transform(element, 0);

      const offset = getOffset(element);

      element.extra = 0;
      element.height = offset.height;
      element.offset = offset.top;
      element.position = 0;
    });

    this.listHeight = this.elements.list[0].getBoundingClientRect().height;

    this.scroll = {
      ease: 0.1,
      position: 0,
      current: 0,
      target: 0,
      last: 0,
      clamp: 0,
    };
  }
}
