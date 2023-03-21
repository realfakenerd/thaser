import type Rectangle from './Rectangle';

/**
 * Checks if a given point is inside a Rectangle's bounds.
 * @param rect The Rectangle to check.
 * @param x The X coordinate of the point to check.
 * @param y The Y coordinate of the point to check.
 */
function Contains(rect: Rectangle, x: number, y: number) {
  if (rect.width <= 0 || rect.height <= 0) return false;
  return (
    rect.x <= x &&
    rect.x + rect.width >= x &&
    rect.y <= y &&
    rect.y + rect.height >= y
  );
}

export default Contains;
