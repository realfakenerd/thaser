/**
 * Calculate the fuzzy ceiling of the given value.
 * @param value The value.
 * @param epsilon The epsilon. Default 0.0001.
 */
export function Ceil(value: number, epsilon = 0.0001): number {
  return Math.ceil(value - epsilon);
}

/**
 * Check whether the given values are fuzzily equal.
 *
 * Two numbers are fuzzily equal if their difference is less than `epsilon`.
 * @param a The first value.
 * @param b The second value.
 * @param epsilon The epsilon. Default 0.0001.
 */
export function Equal(a: number, b: number, epsilon = 0.0001): boolean {
  return Math.abs(a - b) < epsilon;
}

/**
 * Calculate the fuzzy floor of the given value.
 * @param value The value.
 * @param epsilon The epsilon. Default 0.0001.
 */
export function Floor(value: number, epsilon = 0.0001): number {
  return Math.floor(value + epsilon);
}

/**
 * Check whether `a` is fuzzily greater than `b`.
 *
 * `a` is fuzzily greater than `b` if it is more than `b - epsilon`.
 * @param a The first value.
 * @param b The second value.
 * @param epsilon The epsilon. Default 0.0001.
 */
export function GreaterThan(a: number, b: number, epsilon = 0.0001): boolean {
  return a > b - epsilon;
}

/**
 * Check whether `a` is fuzzily less than `b`.
 *
 * `a` is fuzzily less than `b` if it is less than `b + epsilon`.
 * @param a The first value.
 * @param b The second value.
 * @param epsilon The epsilon. Default 0.0001.
 */
export function LessThan(a: number, b: number, epsilon = 0.0001): boolean {
  return a < b + epsilon;
}
