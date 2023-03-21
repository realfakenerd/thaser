/**
 * Create an array of numbers (positive and/or negative) progressing from `start`
 * up to but not including `end` by advancing by `step`.
 *
 * If `start` is less than `end` a zero-length range is created unless a negative `step` is specified.
 *
 * Certain values for `start` and `end` (eg. NaN/undefined/null) are currently coerced to 0;
 * for forward compatibility make sure to pass in actual numbers.
 * @param start The start of the range. Default 0.
 * @param end The end of the range. Default null.
 * @param step The value to increment or decrement by. Default 1.
 */
function NumberArrayStep(
  start = 0,
  end: number | null = null,
  step = 1
): number[] {
  if (end === null) {
    end = start;
    start = 0;
  }
  const result = [];
  const total = Math.max(RoundAwayFromZero((end - start) / (step || 1)), 0);
  let i = 0;
  for (i; i < total; i++) {
    result.push(start);
    start += step;
  }
  return result;
}

export default NumberArrayStep;
