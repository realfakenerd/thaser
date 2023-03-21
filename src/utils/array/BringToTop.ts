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

export default BringToTop;