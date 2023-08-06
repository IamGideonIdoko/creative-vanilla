import AutoBind from 'auto-bind';

export default class {
  protected element: HTMLElement | null;
  protected elements: Record<string, HTMLElement | null>;

  public constructor({
    element,
    elements,
  }: {
    element: string | HTMLElement;
    elements?: Record<string, string | HTMLElement>;
  }) {
    AutoBind(this);
    if (element instanceof window.HTMLElement) {
      this.element = element;
    } else {
      this.element = document.querySelector(element);
    }

    this.elements = Object.fromEntries(
      Object.entries({ ...elements }).map(([key, child]) => {
        if (child instanceof window.HTMLElement) {
          return [key, child];
        } else {
          return [key, document.querySelector(child)];
        }
      }),
    );
  }
}
