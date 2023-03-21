import type Rectangle from './Rectangle';

/**
 * Moves the top-left corner of a Rectangle so that its center is at the given coordinates.
 * @param rect The Rectangle to be centered.
 * @param x The X coordinate of the Rectangle's center.
 * @param y The Y coordinate of the Rectangle's center.
 */
function CenterOn<O extends Rectangle>(rect: O, x: number, y: number) {
  rect.x = x - rect.width / 2;
  rect.y = y - rect.height / 2;
  return rect;
}

export default CenterOn;
