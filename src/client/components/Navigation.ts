import gsap from 'gsap';
import Component from '@/c/base/Component';
import { COLOR_BRIGHT_GRAY, COLOR_QUARTER_SPANISH_WHITE } from '@/c/utils/colors';

export const name: Record<never, string> = {
  asdf: 'asdf',
};

export default class Navigation extends Component<'element', 'items' | 'links'> {
  public constructor({ pathname }: { pathname: string }) {
    super({
      elements: {
        items: '.navigation__list__item',
        links: '.navigation__list__link',
      },
    });

    this.onChange(pathname);
  }

  public onChange(pathname: string) {
    if (pathname === '/about') {
      gsap.set(this.elements.items, {
        color: COLOR_BRIGHT_GRAY,
      });

      gsap.set(this.elements.items[0], { autoAlpha: 1 });
      gsap.set(this.elements.items[1], { autoAlpha: 0 });
    } else {
      gsap.set(this.element, {
        color: COLOR_QUARTER_SPANISH_WHITE,
      });

      gsap.set(this.elements.items[0], { autoAlpha: 0 });
      gsap.set(this.elements.items[1], { autoAlpha: 1 });
    }
  }
}
