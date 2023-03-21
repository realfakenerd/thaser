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
export default MoveDown;
