import GSAP from 'gsap';
import type { TweenValue } from '@/c/interfaces/gsap.interface';

class Colors {
  public change({ backgroundColor, color }: Record<'backgroundColor' | 'color', TweenValue>) {
    GSAP.to(document.documentElement, {
      background: backgroundColor,
      color,
      duration: 1.5,
    });
  }
}

export const ColorsManager = new Colors();
