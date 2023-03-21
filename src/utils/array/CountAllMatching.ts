import SafeRange from './SafeRange';

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

export default CountAllMatching;
