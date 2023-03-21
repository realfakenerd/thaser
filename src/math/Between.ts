/**
 * Compute a random integer between the `min` and `max` values, inclusive.
 * @param min The minimum value.
 * @param max The maximum value.
 */
function Between(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default Between;
