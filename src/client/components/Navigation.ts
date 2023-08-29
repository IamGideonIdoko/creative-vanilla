import GSAP from 'gsap';
import Link from '@/c/animations/Link';
import Component from '@/c/base/Component';
import { COLOR_BRIGHT_GRAY, COLOR_QUARTER_SPANISH_WHITE } from '@/c/utils/colors.util';

export default class Navigation extends Component {
  public constructor({ pathname }: { pathname: string }) {
    super({
      element: '.navigation',
      elements: {
        items: '.navigation__list__item',
        links: '.navigation__list__link',
      },
    });

    this.elements.links.map((element) => {
      return new Link({
        element,
      });
    });

    this.onChange(pathname);
  }

  public onChange(pathname: string) {
    if (pathname === '/about') {
      GSAP.set(this.element, {
        color: COLOR_BRIGHT_GRAY,
      });

      GSAP.set(this.elements.items[0], { autoAlpha: 1 });
      GSAP.set(this.elements.items[1], { autoAlpha: 0 });
    } else {
      GSAP.set(this.element, {
        color: COLOR_QUARTER_SPANISH_WHITE,
      });

      GSAP.set(this.elements.items[0], { autoAlpha: 0 });
      GSAP.set(this.elements.items[1], { autoAlpha: 1 });
    }
  }
}
