import AutoBind from 'auto-bind';
import Prefix from 'prefix';

export default class Component<
  E extends string = string,
  EE extends Record<string, string> | object = object,
  MappedE extends HTMLElement = HTMLElement,
  MappedEE extends Record<keyof EE, HTMLElement[]> = Record<keyof EE, HTMLElement[]>,
> {
  protected element: MappedE | null;
  protected elements?: MappedEE;
  protected readonly transformPrefix = Prefix('transform') as 'transform';

  public constructor({ element, elements }: { element: E; elements?: EE }) {
    AutoBind(this);
    this.element = document.querySelector(element);

    if (elements) {
      this.elements = Object.fromEntries(
        Object.entries({ ...elements }).map(([key, child]) => {
          return [key, document.querySelectorAll(child)];
        }),
      ) as unknown as MappedEE;
    }
  }
}
