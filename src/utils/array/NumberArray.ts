/**
 * Create an array representing the range of numbers (usually integers), between, and inclusive of,
 * the given `start` and `end` arguments. For example:
 *
 * `const array = Phaser.Utils.Array.NumberArray(2, 4); // array = [2, 3, 4]`
 * `const array = Phaser.Utils.Array.NumberArray(0, 9); // array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]`
 * `const array = Phaser.Utils.Array.NumberArray(8, 2); // array = [8, 7, 6, 5, 4, 3, 2]`
 *
 * This is equivalent to `Phaser.Utils.Array.NumberArrayStep(start, end, 1)`.
 *
 * You can optionally provide a prefix and / or suffix string. If given the array will contain
 * strings, not integers. For example:
 *
 * `const array = Phaser.Utils.Array.NumberArray(1, 4, 'Level '); // array = ["Level 1", "Level 2", "Level 3", "Level 4"]`
 * `const array = Phaser.Utils.Array.NumberArray(5, 7, 'HD-', '.png'); // array = ["HD-5.png", "HD-6.png", "HD-7.png"]`
 * @param start The minimum value the array starts with.
 * @param end The maximum value the array contains.
 * @param prefix Optional prefix to place before the number. If provided the array will contain strings, not integers.
 * @param suffix Optional suffix to place after the number. If provided the array will contain strings, not integers.
 */
function NumberArray(
  start: number,
  end: number,
  prefix?: string,
  suffix?: string
): (number | string)[] {
  const result = [];

  let i: number;
  let asString = false;

  if (prefix || suffix) {
    asString = true;
    if (!prefix) {
      prefix = '';
    }
    if (!suffix) {
      suffix = '';
    }
  }

  if (end < start) {
    for (i = start; i >= end; i--) {
      if (asString) {
        result.push(prefix + i.toString() + suffix);
      } else {
        result.push(i);
      }
    }
  } else {
    for (i = start; i <= end; i++) {
      if (asString) {
        result.push(prefix + i.toString() + suffix);
      } else {
        result.push(i);
      }
    }
  }

  return result;
}
export default NumberArray;
