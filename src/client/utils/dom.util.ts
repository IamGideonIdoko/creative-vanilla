export const findAncestor = (element: Element | null, selectors: string) => {
  type VendorElement = Element & Record<'mozMatchesSelector' | 'msMatchesSelector', (selectors: string) => boolean>;
  while (
    (element = element?.parentElement || null) &&
    !(
      element.matches ||
      (element as VendorElement).mozMatchesSelector ||
      (element as VendorElement).msMatchesSelector
    ).call(element, selectors)
  ) {
    return element;
  }
};

export const getOffset = (element: Element, scroll = 0) => {
  const box = element.getBoundingClientRect();

  return {
    bottom: box.bottom,
    height: box.height,
    left: box.left,
    top: box.top + scroll,
    width: box.width,
  };
};

export function getIndex(element: Element | null) {
  let index = 0;

  while ((element = element?.previousElementSibling || null)) {
    index++;
  }

  return index;
}

export const easing = `cubic-bezier(0.19, 1, 0.22, 1)`;
