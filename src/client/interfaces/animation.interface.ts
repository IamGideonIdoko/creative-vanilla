export type Scroll = Record<'ease' | 'position' | 'current' | 'target' | 'last' | 'clamp' | 'limit', number>;

export interface IAnimation {
  // animateIn: () => void;
  // animateOut: () => void;
  update: (scroll: Scroll) => void;
  onResize: () => void;
}

export type ScrollingItem = HTMLLIElement &
  Partial<Record<'extra' | 'height' | 'offset' | 'position' | 'clamp', number>> & {
    isBefore?: boolean;
    isAfter?: boolean;
  };

export type MarqueeScroll = Record<keyof Omit<Scroll, 'limit' | 'clamp'> | 'speed', number>;

export type MarqueeItem = HTMLSpanElement &
  Partial<Record<'extra' | 'height' | 'width' | 'offset' | 'position', number>> & {
    isBefore?: boolean;
    isAfter?: boolean;
  };
