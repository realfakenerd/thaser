import type Rectangle from './Rectangle';

/**
 * Calculates the perimeter of a Rectangle.
 * @param rect The Rectangle to use.
 */
function Perimeter(rect: Rectangle) {
  return 2 * (rect.width + rect.height);
}

export default Perimeter;
