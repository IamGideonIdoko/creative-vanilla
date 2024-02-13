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

export const render = (type: 'self' | 'child', element: HTMLElement | null, html: string) => {
  if (element) {
    if (type === 'self') {
      // ! Create a temporary div to hold the new content
      const template = window.document.createElement('div');
      template.innerHTML = html;
      // ! Replace the old element with the new content node
      if (element?.parentNode && template.firstChild) element.parentNode.replaceChild(template.firstChild, element);
    } else if (type === 'child') {
      element.innerHTML = html;
    }
  }
};

// ! Easily add listeners to dom elements
export const on = <E extends HTMLElement, K extends keyof HTMLElementEventMap = keyof HTMLElementEventMap>(
  dom: Document | HTMLElement,
  selector: string,
  eventType: K,
  callback: (this: E, ev: HTMLElementEventMap[K]) => unknown,
  options?: boolean | AddEventListenerOptions,
): (() => void) => {
  const elements = dom.querySelectorAll<E>(selector);

  if (elements.length === 0) {
    __DEV__ && console.error(`No elements found with selector: ${selector}`);
  }

  elements.forEach((element) => {
    element.addEventListener(eventType, callback as unknown as () => void, options);
  });

  // ! Cleanup
  return () => {
    elements.forEach((element) => {
      element.removeEventListener(eventType, callback as unknown as () => void, options);
    });
  };
};

// ! Easily loop through dom elements
export const all = <E extends HTMLElement>(
  dom: Document | HTMLElement,
  selector: string,
  callback?: (e: E) => void,
) => {
  const elements = dom.querySelectorAll<E>(selector);
  callback && elements.forEach((e) => callback(e));
  return elements;
};

// ! Easily loop through dom elements
export const one = <E extends HTMLElement>(
  dom: Document | HTMLElement,
  selector: string,
  callback?: (e: E | null) => void,
) => {
  const element = dom.querySelector<E>(selector);
  callback && callback(element);
  return element;
};
