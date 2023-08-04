import GSAP from 'gsap';

export function lerp(p1: number, p2: number, t: number) {
  return GSAP.utils.interpolate<number>(p1, p2, t);
}

export function clamp(min: number, max: number, number: number) {
  return GSAP.utils.clamp(min, max, number);
}

export function random(min: number, max: number) {
  return GSAP.utils.random(min, max);
}

export function map(valueToMap: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return GSAP.utils.mapRange(inMin, inMax, outMin, outMax, valueToMap);
}
