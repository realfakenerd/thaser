import { GetValue } from '@utils';

/**
 * Adds the given item, or array of items, to the array.
 *
 * Each item must be unique within the array.
 *
 * The array is modified in-place and returned.
 *
 * You can optionally specify a limit to the maximum size of the array. If the quantity of items being
 * added will take the array length over this limit, it will stop adding once the limit is reached.
 *
 * You can optionally specify a callback to be invoked for each item successfully added to the array.
 * @param array The array to be added to.
 * @param item The item, or array of items, to add to the array. Each item must be unique within the array.
 * @param limit Optional limit which caps the size of the array.
 * @param callback A callback to be invoked for each item successfully added to the array.
 * @param context The context in which the callback is invoked.
 */
function Add<T>(
  array: any[],
  item: T | T[],
  limit?: number,
  callback?: Function,
  context = array
) {
  const remaining = limit! - array.length;
  if (limit && limit > 0) {
    if (remaining <= 0) return null as any;
  }

  if (!Array.isArray(item)) {
    if (array.indexOf(item) === -1) {
      array.push(item);
      if (callback) {
        callback.call(context, item);
      }
      return item;
    } else return null as any;
  }

  let itemLength = item.length - 1;
  while (itemLength >= 0) {
    if (array.indexOf(item[itemLength]) !== -1) {
      item.splice(itemLength, 1);
    }
    itemLength--;
  }

  itemLength = item.length;

  if (itemLength === 0) return null as any;

  if (limit && limit > 0 && itemLength > remaining) {
    item.splice(remaining);
    itemLength = remaining;
  }

  let i = 0;
  for (i; i < itemLength; i++) {
    const entry = item[i];
    array.push(entry);
    if (callback) {
      callback.call(context, entry);
    }
  }

  return item as T[];
}

/**
 * Adds the given item, or array of items, to the array starting at the index specified.
 *
 * Each item must be unique within the array.
 *
 * Existing elements in the array are shifted up.
 *
 * The array is modified in-place and returned.
 *
 * You can optionally specify a limit to the maximum size of the array. If the quantity of items being
 * added will take the array length over this limit, it will stop adding once the limit is reached.
 *
 * You can optionally specify a callback to be invoked for each item successfully added to the array.
 * @param array The array to be added to.
 * @param item The item, or array of items, to add to the array.
 * @param index The index in the array where the item will be inserted. Default 0.
 * @param limit Optional limit which caps the size of the array.
 * @param callback A callback to be invoked for each item successfully added to the array.
 * @param context The context in which the callback is invoked.
 */
function AddAt<T>(
  array: any[],
  item: T | T[],
  index = 0,
  limit?: number,
  callback?: Function,
  context = array
) {
  const remaining = limit! - array.length;
  if (limit && limit > 0) {
    if (remaining <= 0) return null as any;
  }

  if (!Array.isArray(item)) {
    if (array.indexOf(item) === -1) {
      array.splice(index, 0, item);

      if (callback) {
        callback.call(context, item);
      }

      return item;
    } else return null as any;
  }

  let itemLength = item.length - 1;

  while (itemLength >= 0) {
    if (array.indexOf(item[itemLength]) !== -1) {
      item.pop();
    }

    itemLength--;
  }

  itemLength = item.length;

  if (itemLength === 0) return null as any;

  //  Truncate to the limit
  if (limit && limit > 0 && itemLength > remaining) {
    item.splice(remaining);

    itemLength = remaining;
  }

  let i = itemLength;
  for (i - 1; i >= 0; i--) {
    const entry = item[i];

    array.splice(index, 0, entry);

    if (callback) {
      callback.call(context, entry);
    }
  }

  return item as T[];
}

/**
 * Moves the given element to the top of the array.
 * The array is modified in-place.
 * @param array The array.
 * @param item The element to move.
 */
function BringToTop(array: any[], item: any): any {
  const currentIndex = array.indexOf(item);

  if (currentIndex !== -1 && currentIndex < array.length) {
    array.splice(currentIndex, 1);
    array.push(item);
  }

  return item;
}

/**
 * Returns the total number of elements in the array which have a property matching the given value.
 * @param array The array to search.
 * @param property The property to test on each array element.
 * @param value The value to test the property against. Must pass a strict (`===`) comparison check.
 * @param startIndex An optional start index to search from.
 * @param endIndex An optional end index to search to.
 */
function CountAllMatching(
  array: any[],
  property: string,
  value: any,
  startIndex = 0,
  endIndex = array.length
): number {
  let total = 0;

  if (SafeRange(array, startIndex, endIndex)) {
    let i = startIndex;
    for (i; i < endIndex; i++) {
      const child = array[i];

      if (child[property] === value) {
        total++;
      }
    }
  }

  return total;
}

/**
 * Passes each element in the array to the given callback.
 * @param array The array to search.
 * @param callback A callback to be invoked for each item in the array.
 * @param context The context in which the callback is invoked.
 * @param args Additional arguments that will be passed to the callback, after the current array item.
 */
function Each(
  array: any[],
  callback: Function,
  context: object,
  ...args: any[]
): any[] {
  let i: number;
  const _args = [null];
  const argsLength = arguments.length;
  const arrLength = array.length;
  for (i = 3; i < argsLength; i++) {
    _args.push(arguments[i]);
  }
  for (i = 0; i < arrLength; i++) {
    _args[0] = array[i];
    callback.apply(context, args);
  }

  return array;
}

/**
 * Passes each element in the array, between the start and end indexes, to the given callback.
 * @param array The array to search.
 * @param callback A callback to be invoked for each item in the array.
 * @param context The context in which the callback is invoked.
 * @param startIndex The start index to search from.
 * @param endIndex The end index to search to.
 * @param args Additional arguments that will be passed to the callback, after the child.
 */
function EachInRange(
  array: any[],
  callback: Function,
  context: object,
  startIndex = 0,
  endIndex = array.length,
  ...args: any[]
): any[] {
  if (SafeRange(array, startIndex, endIndex)) {
    let i: number;
    const _args = [null];
    const argsLength = arguments.length;

    for (i = 5; i < argsLength; i++) {
      _args.push(arguments[i]);
    }

    for (i = startIndex; i < endIndex; i++) {
      _args[0] = array[i];

      callback.apply(context, _args);
    }
  }

  return array;
}

/**
 * Searches a pre-sorted array for the closet value to the given number.
 *
 * If the `key` argument is given it will assume the array contains objects that all have the required `key` property name,
 * and will check for the closest value of those to the given number.
 * @param value The value to search for in the array.
 * @param array The array to search, which must be sorted.
 * @param key An optional property key. If specified the array elements property will be checked against value.
 */
function FindClosestInSorted(
  value: number,
  array: any[],
  key?: string
): number | any {
  if (!array.length) return NaN;
  else if (array.length === 1) return array[0];

  let i = 1;
  let low;
  let high;

  if (key) {
    if (value < array[0][key]) return array[0];

    while (array[i][key] < value) {
      i++;
    }
  } else {
    while (array[i] < value) {
      i++;
    }
  }

  if (i > array.length) {
    i = array.length;
  }

  if (key) {
    low = array[i - 1][key];
    high = array[i][key];

    return high - value <= value - low ? array[i] : array[i - 1];
  } else {
    low = array[i - 1];
    high = array[i];

    return high - value <= value - low ? high : low;
  }
}

/**
 * Returns all elements in the array.
 *
 * You can optionally specify a matching criteria using the `property` and `value` arguments.
 *
 * For example: `getAll('visible', true)` would return only elements that have their visible property set.
 *
 * Optionally you can specify a start and end index. For example if the array had 100 elements,
 * and you set `startIndex` to 0 and `endIndex` to 50, it would return matches from only
 * the first 50 elements.
 * @param array The array to search.
 * @param property The property to test on each array element.
 * @param value The value to test the property against. Must pass a strict (`===`) comparison check.
 * @param startIndex An optional start index to search from.
 * @param endIndex An optional end index to search to.
 */
function GetAll(
  array: any[],
  property?: string,
  value?: any,
  startIndex = 0,
  endIndex = array.length
): any[] {
  const output = [];

  if (SafeRange(array, startIndex, endIndex)) {
    let i = startIndex;
    for (i; i < endIndex; i++) {
      const child = array[i];

      if (
        !property ||
        (property && value === undefined && child.hasOwnProperty(property)) ||
        (property && value !== undefined && child[property] === value)
      ) {
        output.push(child);
      }
    }
  }

  return output;
}

/**
 * Returns the first element in the array.
 *
 * You can optionally specify a matching criteria using the `property` and `value` arguments.
 *
 * For example: `getAll('visible', true)` would return the first element that had its `visible` property set.
 *
 * Optionally you can specify a start and end index. For example if the array had 100 elements,
 * and you set `startIndex` to 0 and `endIndex` to 50, it would search only the first 50 elements.
 * @param array The array to search.
 * @param property The property to test on each array element.
 * @param value The value to test the property against. Must pass a strict (`===`) comparison check.
 * @param startIndex An optional start index to search from. Default 0.
 * @param endIndex An optional end index to search up to (but not included) Default array.length.
 */
function GetFirst<T>(
  array: T[],
  property?: string,
  value?: any,
  startIndex = 0,
  endIndex = array.length
) {
  if (SafeRange(array, startIndex, endIndex)) {
    let i = startIndex;
    for (i; i < endIndex; i++) {
      const child = array[i];

      if (
        !property ||
        (property && value === undefined && child.hasOwnProperty(property)) ||
        (property && value !== undefined && child[property] === value)
      ) {
        return child;
      }
    }
  }

  return null as T;
}

/**
 * Returns a Random element from the array.
 * @param array The array to select the random entry from.
 * @param startIndex An optional start index. Default 0.
 * @param length An optional length, the total number of elements (from the startIndex) to choose from. Default array.length.
 */
function GetRandom(array: any[], startIndex = 0, length = array.length): any {
  const randomIndex = startIndex + Math.floor(Math.random() * length);
  return array[randomIndex] === undefined ? null : array[randomIndex];
}

/**
 * Tests if the start and end indexes are a safe range for the given array.
 * @param array The array to check.
 * @param startIndex The start index.
 * @param endIndex The end index.
 * @param throwError Throw an error if the range is out of bounds. Default true.
 */
function SafeRange(
  array: any[],
  startIndex: number,
  endIndex: number,
  throwError?: boolean
): boolean {
  const len = array.length;

  if (
    startIndex < 0 ||
    startIndex > len ||
    startIndex >= endIndex ||
    endIndex > len
  ) {
    if (throwError) {
      throw new Error('Range Error: Values outside acceptable range');
    }

    return false;
  } else return true;
}

/**
 * Moves the given array element above another one in the array.
 * The array is modified in-place.
 * @param array The input array.
 * @param item1 The element to move above base element.
 * @param item2 The base element.
 */
function MoveAbove(array: any[], item1: any, item2: any): any[] {
  if (item1 === item2) return array;
  const currentIndex = array.indexOf(item1);
  const baseIndex = array.indexOf(item2);
  if (currentIndex < 0 || baseIndex < 0) {
    throw new Error('Supplied items must be elements of the same array');
  }
  if (currentIndex > baseIndex) return array;
  array.splice(currentIndex, 1);
  if (baseIndex === array.length - 1) {
    array.push(item1);
  } else {
    array.splice(baseIndex, 0, item1);
  }
  return array;
}

/**
 * Moves the given array element below another one in the array.
 * The array is modified in-place.
 * @param array The input array.
 * @param item1 The element to move below base element.
 * @param item2 The base element.
 */
function MoveBelow(array: any[], item1: any, item2: any): any[] {
  if (item1 === item2) return array;
  const currentIndex = array.indexOf(item1);
  const baseIndex = array.indexOf(item2);
  if (currentIndex < 0 || baseIndex < 0) {
    throw new Error('Supplied items must be elements of the same array');
  }
  if (currentIndex < baseIndex) return array;
  array.splice(currentIndex, 1);
  if (baseIndex === 0) {
    array.unshift(item1);
  } else {
    array.splice(baseIndex, 0, item1);
  }
  return array;
}

/**
 * Moves the given array element down one place in the array.
 * The array is modified in-place.
 * @param array The input array.
 * @param item The element to move down the array.
 */
function MoveDown(array: any[], item: any): any[] {
  const currentIndex = array.indexOf(item);
  if (currentIndex > 0) {
    const item2 = array[currentIndex - 1];
    const index2 = array.indexOf(item2);
    array[currentIndex] = item2;
    array[index2] = item;
  }
  return array;
}

/**
 * Moves an element in an array to a new position within the same array.
 * The array is modified in-place.
 * @param array The array.
 * @param item The element to move.
 * @param index The new index that the element will be moved to.
 */
function MoveTo(array: any[], item: any, index: number): any {
  const currentIndex = array.indexOf(item);
  if (currentIndex === -1 || index < 0 || index >= array.length) {
    throw new Error('Supplied index out of bounds');
  }
  if (currentIndex !== index) {
    array.splice(currentIndex, 1);
    array.splice(index, 0, item);
  }
  return item;
}

/**
 * Moves the given array element up one place in the array.
 * The array is modified in-place.
 * @param array The input array.
 * @param item The element to move up the array.
 */
function MoveUp(array: any[], item: any): any[] {
  const currentIndex = array.indexOf(item);
  if (currentIndex !== -1 && currentIndex < array.length - 1) {
    const item2 = array[currentIndex + 1];
    const index2 = array.indexOf(item2);
    array[currentIndex] = item2;
    array[index2] = item;
  }
  return array;
}

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

function swap(arr: any[], i: any, j: any) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

function defaultCompare(a: any, b: any) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * A [Floyd-Rivest](https://en.wikipedia.org/wiki/Floyd%E2%80%93Rivest_algorithm) quick selection algorithm.
 *
 * Rearranges the array items so that all items in the [left, k] range are smaller than all items in [k, right];
 * The k-th element will have the (k - left + 1)th smallest value in [left, right].
 *
 * The array is modified in-place.
 *
 * Based on code by [Vladimir Agafonkin](https://www.npmjs.com/~mourner)
 * @param arr The array to sort.
 * @param k The k-th element index.
 * @param left The index of the left part of the range. Default 0.
 * @param right The index of the right part of the range.
 * @param compare An optional comparison function. Is passed two elements and should return 0, 1 or -1.
 */
function QuickSelect(
  arr: any[],
  k: number,
  left = 0,
  right = arr.length - 1,
  compare = defaultCompare
): void {
  while (right > left) {
    if (right - left > 600) {
      const n = right - left + 1;
      const m = k - left + 1;
      const z = Math.log(n);
      const s = 0.5 * Math.exp((2 * z) / 3);
      const sd =
        0.5 * Math.sqrt((z * s * (n - s)) / n) * (m - n / 2 < 0 ? -1 : 1);
      const newLeft = Math.max(left, Math.floor(k - (m * s) / n + sd));
      const newRight = Math.min(right, Math.floor(k + ((n - m) * s) / n + sd));

      QuickSelect(arr, k, newLeft, newRight, compare);
    }
    const t = arr[k];
    let i = left;
    let j = right;

    swap(arr, left, k);

    if (compare(arr[right], t) > 0) {
      swap(arr, left, right);
    }

    while (i < j) {
      swap(arr, i, j);

      i++;
      j--;

      while (compare(arr[i], t) < 0) {
        i++;
      }

      while (compare(arr[j], t) > 0) {
        j--;
      }
    }

    if (compare(arr[left], t) === 0) {
      swap(arr, left, j);
    } else {
      j++;
      swap(arr, j, right);
    }

    if (j <= k) {
      left = j + 1;
    }

    if (k <= j) {
      right = j - 1;
    }
  }
}

interface ChunkDef {
  a: number;
  b: number;
}

function BuildChunk(a: number[], b: number[], qty: number): ChunkDef[] {
  const out: ChunkDef[] = [];

  let aIndex = 0;
  const aLength = a.length;
  for (aIndex; aIndex < aLength; aIndex++) {
    let bIndex = 0;
    const bLength = b.length;
    for (bIndex; bIndex < bLength; bIndex++) {
      let i = 0;
      for (i; i < qty; i++) {
        out.push({ a: a[aIndex], b: b[bIndex] });
      }
    }
  }

  return out;
}

/**
 * Creates an array populated with a range of values, based on the given arguments and configuration object.
 *
 * Range ([a,b,c], [1,2,3]) =
 * a1, a2, a3, b1, b2, b3, c1, c2, c3
 *
 * Range ([a,b], [1,2,3], qty = 3) =
 * a1, a1, a1, a2, a2, a2, a3, a3, a3, b1, b1, b1, b2, b2, b2, b3, b3, b3
 *
 * Range ([a,b,c], [1,2,3], repeat x1) =
 * a1, a2, a3, b1, b2, b3, c1, c2, c3, a1, a2, a3, b1, b2, b3, c1, c2, c3
 *
 * Range ([a,b], [1,2], repeat -1 = endless, max = 14) =
 * Maybe if max is set then repeat goes to -1 automatically?
 * a1, a2, b1, b2, a1, a2, b1, b2, a1, a2, b1, b2, a1, a2 (capped at 14 elements)
 *
 * Range ([a], [1,2,3,4,5], random = true) =
 * a4, a1, a5, a2, a3
 *
 * Range ([a, b], [1,2,3], random = true) =
 * b3, a2, a1, b1, a3, b2
 *
 * Range ([a, b, c], [1,2,3], randomB = true) =
 * a3, a1, a2, b2, b3, b1, c1, c3, c2
 *
 * Range ([a], [1,2,3,4,5], yoyo = true) =
 * a1, a2, a3, a4, a5, a5, a4, a3, a2, a1
 *
 * Range ([a, b], [1,2,3], yoyo = true) =
 * a1, a2, a3, b1, b2, b3, b3, b2, b1, a3, a2, a1
 * @param a The first array of range elements.
 * @param b The second array of range elements.
 * @param options A range configuration object. Can contain: repeat, random, randomB, yoyo, max, qty.
 */
function Range(a: any[], b: any[], options?: Record<any, any>): any[] {
  const max = GetValue(options!, 'max', 0);
  const qty = GetValue(options!, 'qty', 1);
  const random = GetValue(options!, 'random', false);
  const randomB = GetValue(options!, 'randomB', false);
  let repeat = GetValue(options!, 'repeat', 0);
  const yoyo = GetValue(options!, 'yoyo', false);
  let out: ChunkDef[] = [];
  if (randomB) {
    Shuffle(b);
  }
  if (repeat === -1) {
    if (max === 0) {
      repeat = 0;
    } else {
      let total = a.length * b.length * qty;
      if (yoyo) {
        total *= 2;
      }
      repeat = Math.ceil(max / total);
    }
  }

  let i = 0;
  for (i; i <= repeat; i++) {
    const chunk = BuildChunk(a, b, qty);
    if (random) {
      Shuffle(chunk);
    }
    out = out.concat(chunk);
    if (yoyo) {
      chunk.reverse();
      out = out.concat(chunk);
    }
  }
  if (max) {
    out.splice(max);
  }
  return out;
}

/**
 * Removes the given item, or array of items, from the array.
 *
 * The array is modified in-place.
 *
 * You can optionally specify a callback to be invoked for each item successfully removed from the array.
 * @param array The array to be modified.
 * @param item The item, or array of items, to be removed from the array.
 * @param callback A callback to be invoked for each item successfully removed from the array.
 * @param context The context in which the callback is invoked.
 */
function Remove(
  array: any[],
  item: any | any[],
  callback?: Function,
  context = array
): any | any[] {
  let index: number;

  if (!Array.isArray(item)) {
    index = array.indexOf(item);

    if (index !== -1) {
      SpliceOne(array, index);

      if (callback) {
        callback.call(context, item);
      }

      return item;
    } else return null;
  }

  let itemLength = item.length - 1;
  const removed = [];

  while (itemLength >= 0) {
    const entry = item[itemLength];

    index = array.indexOf(entry);
    if (index !== -1) {
      SpliceOne(array, index);
      removed.push(entry);

      if (callback) {
        callback.call(context, entry);
      }
    }

    itemLength--;
  }

  return removed;
}

/**
 * Removes the item from the given position in the array.
 *
 * The array is modified in-place.
 *
 * You can optionally specify a callback to be invoked for the item if it is successfully removed from the array.
 * @param array The array to be modified.
 * @param index The array index to remove the item from. The index must be in bounds or it will throw an error.
 * @param callback A callback to be invoked for the item removed from the array.
 * @param context The context in which the callback is invoked.
 */
function RemoveAt(
  array: any[],
  index: number,
  callback?: Function,
  context = array
): any {
  if (index < 0 || index > array.length - 1) {
    throw new Error('Index out of bounds');
  }
  const item = SpliceOne(array, index);
  if (callback) {
    callback.call(context, item);
  }
  return item;
}

/**
 * Removes the item within the given range in the array.
 *
 * The array is modified in-place.
 *
 * You can optionally specify a callback to be invoked for the item/s successfully removed from the array.
 * @param array The array to be modified.
 * @param startIndex The start index to remove from.
 * @param endIndex The end index to remove to.
 * @param callback A callback to be invoked for the item removed from the array.
 * @param context The context in which the callback is invoked.
 */
function RemoveBetween(
  array: any[],
  startIndex = 0,
  endIndex = array.length,
  callback?: Function,
  context = array
): any[] {
  if (SafeRange(array, startIndex, endIndex)) {
    const size = endIndex - startIndex;
    const removed = array.splice(startIndex, size);
    if (callback) {
      let i = 0;
      const length = removed.length;
      for (i; i < length; i++) {
        const entry = removed[i];
        callback.call(context, entry);
      }
    }
    return removed;
  } else return [];
}

/**
 * Removes a random object from the given array and returns it.
 * Will return null if there are no array items that fall within the specified range or if there is no item for the randomly chosen index.
 * @param array The array to removed a random element from.
 * @param start The array index to start the search from. Default 0.
 * @param length Optional restriction on the number of elements to randomly select from. Default array.length.
 */
function RemoveRandomElement(
  array: any[],
  start = 0,
  length = array.length
): object {
  const randomIndex = start + Math.floor(Math.random() * length);
  return SpliceOne(array, randomIndex);
}

/**
 * Moves the given element to the bottom of the array.
 * The array is modified in-place.
 * @param array The array.
 * @param item The element to move.
 */
function SendToBack(array: any[], item: any): any {
  const currentIndex = array.indexOf(item);
  if (currentIndex !== -1 && currentIndex > 0) {
    array.splice(currentIndex, 1);
    array.unshift(item);
  }
  return item;
}

/**
 * Scans the array for elements with the given property. If found, the property is set to the `value`.
 *
 * For example: `SetAll('visible', true)` would set all elements that have a `visible` property to `false`.
 *
 * Optionally you can specify a start and end index. For example if the array had 100 elements,
 * and you set `startIndex` to 0 and `endIndex` to 50, it would update only the first 50 elements.
 * @param array The array to search.
 * @param property The property to test for on each array element.
 * @param value The value to set the property to.
 * @param startIndex An optional start index to search from.
 * @param endIndex An optional end index to search to.
 */
function SetAll(
  array: any[],
  property: string,
  value: any,
  startIndex = 0,
  endIndex = array.length
): any[] {
  if (SafeRange(array, startIndex, endIndex)) {
    let i = startIndex;
    for (i; i < endIndex; i++) {
      const entry = array[i];
      if (entry.hasOwnProperty(property)) {
        entry[property] = value;
      }
    }
  }
  return array;
}

/**
 * Shuffles the contents of the given array using the Fisher-Yates implementation.
 *
 * The original array is modified directly and returned.
 * @param array The array to shuffle. This array is modified in place.
 */
function Shuffle<T>(array: T[]): T[] {
  let i = array.length - 1;
  for (i; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

/**
 * Takes the given array and runs a numeric sort on it, ignoring any non-digits that
 * may be in the entries.
 *
 * You should only run this on arrays containing strings.
 * @param array The input array of strings.
 */
function SortByDigits(array: string[]): string[] {
  const re = /\D/g;
  array.sort(
    (a, b) => parseInt(a.replace(re, ''), 10) - parseInt(b.replace(re, ''), 10)
  );
  return array;
}

function Compare(a: any, b: any) {
  return String(a).localeCompare(b);
}

function Process(array: any[], compare: Function) {
  const len = array.length;
  if (len <= 1) {
    return array;
  }
  let buffer = new Array(len);
  let chk = 1;
  for (chk; chk < len; chk *= 2) {
    RunPass(array, compare, chk, buffer);
    const tmp = array;
    array = buffer;
    buffer = tmp;
  }

  return array;
}

function RunPass(
  arr: any[],
  comp: Function | null,
  chk: number,
  result: any[]
) {
  const len = arr.length;
  let i = 0;
  const dbl = chk * 2;
  let l, r, e;
  let li, ri;
  for (l = 0; l < len; l += dbl) {
    r = l + chk;
    e = r + chk;

    if (r > len) {
      r = len;
    }

    if (e > len) {
      e = len;
    }
    li = l;
    ri = r;

    while (true) {
      if (li < r && ri < e) {
        //@ts-ignore
        if (comp(arr[li], arr[ri]) <= 0) {
          result[i++] = arr[li++];
        } else {
          result[i++] = arr[ri++];
        }
      } else if (li < r) {
        result[i++] = arr[li++];
      } else if (ri < e) {
        result[i++] = arr[ri++];
      } else {
        break;
      }
    }
  }
}

/**
 * An in-place stable array sort, because `Array#sort()` is not guaranteed stable.
 *
 * This is an implementation of merge sort, without recursion.
 *
 * Function based on the Two-Screen/stable sort 0.1.8 from https://github.com/Two-Screen/stable
 * @param array The input array to be sorted.
 * @param compare The comparison function.
 */
function StableSort(array: any[], compare = Compare): any[] {
  const result = Process(array, compare);
  if (result !== array) {
    RunPass(result, null, array.length, array);
  }
  return array;
}

/**
 * Swaps the position of two elements in the given array.
 * The elements must exist in the same array.
 * The array is modified in-place.
 * @param array The input array.
 * @param item1 The first element to swap.
 * @param item2 The second element to swap.
 */
function Swap(array: any[], item1: any, item2: any): any[] {
  if (item1 === item2) return array;
  const index1 = array.indexOf(item1);
  const index2 = array.indexOf(item2);
  if (index1 < 0 || index2 < 0) {
    throw new Error('Supplied items must be elements of the same array');
  }
  array[index1] = item2;
  array[index2] = item1;
  return array;
}

/**
 * Replaces an element of the array with the new element.
 * The new element cannot already be a member of the array.
 * The array is modified in-place.
 * @param array The array to search within.
 * @param oldChild The element in the array that will be replaced.
 * @param newChild The element to be inserted into the array at the position of `oldChild`.
 */
function Replace<T,K>(array: any[], oldChild: T, newChild: K): boolean {
  const index1 = array.indexOf(oldChild);
  const index2 = array.indexOf(newChild);
  if (index1 !== -1 && index2 === -1) {
    array[index1] = newChild;
    return true;
  } else return false;
}

/**
 * Moves the element at the start of the array to the end, shifting all items in the process.
 * The "rotation" happens to the left.
 * @param array The array to shift to the left. This array is modified in place.
 * @param total The number of times to shift the array. Default 1.
 */
function RotateLeft(array: any[], total = 1): any {
  let element = null;
  let i = 0;
  for (i; i < total; i++) {
    element = array.shift();
    array.push(element);
  }
  return element;
}

/**
 * Moves the element at the end of the array to the start, shifting all items in the process.
 * The "rotation" happens to the right.
 * @param array The array to shift to the right. This array is modified in place.
 * @param total The number of times to shift the array. Default 1.
 */
function RotateRight(array: any[], total = 1): any {
  let element = null;
  let i = 0;
  for (i; i < total; i++) {
    element = array.pop();
    array.unshift(element);
  }
  return element;
}

/**
 * Removes a single item from an array and returns it without creating gc, like the native splice does.
 * Based on code by Mike Reinstein.
 * @param array The array to splice from.
 * @param index The index of the item which should be spliced.
 */
function SpliceOne(array: any[], index: number): any {
  if (index >= array.length) return;

  const len = array.length - 1;
  const item = array[index];
  for (let i = index; i < len; i++) {
    array[i] = array[i + 1];
  }

  array.length = len;
  return item;
}

/**
 * Takes an array and flattens it, returning a shallow-copy flattened array.
 * @param array - The array to flatten.
 * @param output - An array to hold the results in.
 *
 * @return The flattened output array.
 */
function Flatten(array: any[], output: any[] = []) {
  let i = 0;
  const length = array.length;
  for (i; i < length; i++) {
    if (Array.isArray(array[i])) {
      Flatten(array[i], output);
    } else {
      output.push(array[i]);
    }
  }

  return output;
}

export * from './matrix';
export {
  Add,
  AddAt,
  BringToTop,
  CountAllMatching,
  Each,
  EachInRange,
  FindClosestInSorted,
  Flatten,
  GetAll,
  GetFirst,
  GetRandom,
  MoveDown,
  MoveTo,
  MoveUp,
  MoveAbove,
  MoveBelow,
  NumberArray,
  NumberArrayStep,
  QuickSelect,
  Range,
  Remove,
  RemoveAt as ArrayRemoveAt,
  RemoveBetween,
  RemoveRandomElement,
  Replace,
  RotateLeft,
  RotateRight,
  SafeRange,
  SendToBack,
  SetAll,
  Shuffle,
  SortByDigits,
  SpliceOne,
  StableSort,
  Swap
};
