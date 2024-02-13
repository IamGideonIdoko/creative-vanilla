import AutoBind from 'auto-bind';
import { one, all } from '@/c/utils/dom';

export default class Component<
  E extends string = never,
  EE extends string = never,
  MappedE extends Record<E, HTMLElement | undefined> = Record<E, HTMLElement | undefined>,
  MappedEE extends Record<EE, NodeListOf<HTMLElement>> = Record<EE, NodeListOf<HTMLElement>>,
> {
  protected element = {} as MappedE;
  protected elements = {} as MappedEE;
  public constructor({
    element,
    elements,
  }: Partial<{
    element: E extends never ? never : Record<E, string>;
    elements: EE extends never ? never : Record<EE, string>;
  }>) {
    AutoBind(this);
    if (element) {
      this.element = Object.fromEntries(
        Object.entries({ ...element }).map(([key, child]) => {
          return [key, one(document, child)];
        }),
      ) as MappedE;
    }
    if (elements) {
      this.elements = Object.fromEntries(
        Object.entries({ ...elements }).map(([key, child]) => {
          return [key, all(document, child)];
        }),
      ) as MappedEE;
    }
  }
}
