import Page from '@/c/base/Page';
// import Titles from '@/c/components/Titles';

export default class extends Page<string, Record<'wrapper' | 'list' | 'items', string>> {
  // private title: Titles;
  constructor() {
    super({
      classes: {
        active: 'home--active',
      },

      element: '.home',
      elements: {
        wrapper: '.home__wrapper',
        list: '.home__titles',
        items: '.home__titles__label, .home__titles__title',
      },
    });
  }

  // create() {
  //   super.create();

  //   this.titles = new Titles({
  //     element: 'body',
  //     elements: {
  //       list: this.elements.list,
  //       items: this.elements.items,
  //     },
  //   });

  //   this.titles.enable();
  // }

  /**
   * Animations.
   */
  async show() {
    this.element!.classList.add(this.classes!.active);

    return super.show();
  }

  async hide() {
    this.element!.classList.remove(this.classes!.active);

    return super.hide();
  }

  /**
   * Events.
   */
  onResize() {
    super.onResize();

    // this.titles.onResize();
  }

  // onTouchDown(event) {
  //   this.titles.onTouchDown(event);
  // }

  // onTouchMove(event) {
  //   this.titles.onTouchMove(event);
  // }

  // onTouchUp(event) {
  //   this.titles.onTouchUp(event);
  // }

  // onWheel(event) {
  //   this.titles.onWheel(event);
  // }

  /**
   * Loop.
   */
  update() {
    super.update();

    // this.titles.update();
  }

  /**
   * Destroy.
   */
  destroy() {
    // super.destroy();
  }
}
