import Add from './Add';
import AddAt from './AddAt';
import BringToTop from './BringToTop';
import CountAllMatching from './CountAllMatching';
import Each from './Each';
import EachInRange from './EachInRange';
import MoveAbove from './MoveAbove';
import MoveBelow from './MoveBelow';
import MoveDown from './MoveDown';
import MoveTo from './MoveTo';
import MoveUp from './MoveUp';
import NumberArray from './NumberArray';
import NumberArrayStep from './NumberArrayStep';
import QuickSelect from './QuickSelect';
import Range from './Range';
import SafeRange from './SafeRange';

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
function GetFirst(
  array: any[],
  property?: string,
  value?: any,
  startIndex = 0,
  endIndex = array.length
): object {
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

  return null as any;
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
function Replace(array: any[], oldChild: any, newChild: any): boolean {
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
