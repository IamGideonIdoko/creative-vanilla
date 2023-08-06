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

/**
 * Constrains a value between a minimum and maximum value.
 */
export function constrain(n: number, low: number, high: number) {
  return Math.max(Math.min(n, high), low);
}

/**
 * Calculates the distance between two points.
 */
export function dist(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
  if (arguments.length === 4) {
    return Math.sqrt((z1 - x1) * (z1 - x1) + (x2 - y1) * (x2 - y1));
  } else if (arguments.length === 6) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1));
  }
}

/**
 * Calculates the magnitude (or length) of a vector. A vector is a direction
 * in space commonly used in computer graphics and linear algebra. Because it
 * has no "start" position, the magnitude of a vector can be thought of as
 * the distance from the coordinate 0,0 to its x,y value. Therefore, mag() is
 * a shortcut for writing dist(0, 0, x, y).
 */
export function mag(x: number, y: number) {
  return Math.sqrt(x * x + y * y);
}
