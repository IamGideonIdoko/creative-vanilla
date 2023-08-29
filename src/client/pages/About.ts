import Page from '@/c/base/Page';

export default class extends Page {
  public constructor() {
    super({
      classes: {
        active: 'about--active',
      },

      element: '.about',
      elements: {
        wrapper: '.about__wrapper',
      },
    });
  }

  /**
   * Animations.
   */
  public async show() {
    if (!this.element || !this.classes) return;
    this.element.classList.add(this.classes.active);

    return super.show();
  }

  public async hide() {
    if (!this.element || !this.classes) return;
    this.element.classList.remove(this.classes.active);

    return super.hide();
  }
}
