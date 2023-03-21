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

export default MoveBelow;
