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
export default MoveTo;
