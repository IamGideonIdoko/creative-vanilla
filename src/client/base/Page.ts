import Component from './Component';

export default class Page<
  E extends string = never,
  EE extends string = never,
  MappedE extends Record<E, HTMLElement | undefined> = Record<E, HTMLElement | undefined>,
  MappedEE extends Record<EE, NodeListOf<HTMLElement>> = Record<EE, NodeListOf<HTMLElement>>,
> extends Component<E, EE, MappedE, MappedEE> {
  protected isVisible = false;

  public constructor({
    element,
    elements,
  }: Partial<{
    element: E extends never ? never : Record<E, string>;
    elements: EE extends never ? never : Record<EE, string>;
  }>) {
    super({ element, elements });
    // TODO: Add resize oberserver and lazy loader
  }

  public show() {
    this.isVisible = true;
  }

  public hide() {
    this.isVisible = false;
  }
}
