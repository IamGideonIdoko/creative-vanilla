import Page from '@/c/base/Page';

export default class extends Page<'parent'> {
  public constructor() {
    super({
      element: {
        parent: '.home',
      },
    });
  }

  public async show() {
    if (!this.element.parent) return;
    this.element.parent.classList.add('active');

    return super.show();
  }

  public async hide() {
    if (!this.element.parent) return;
    this.element.parent.classList.remove('active');

    return super.hide();
  }
}
