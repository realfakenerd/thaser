import type Rectangle from './Rectangle';

/**
 * Compares the `x`, `y`, `width` and `height` properties of two rectangles.
 * @param rect Rectangle A
 * @param toCompare Rectangle B
 */
function Equals(rect: Rectangle, toCompare: Rectangle) {
  return (
    rect.x === toCompare.x &&
    rect.y === toCompare.y &&
    rect.width === toCompare.width &&
    rect.height === toCompare.height
  );
}

export default Equals;
