import Rectangle from './Rectangle';

/**
 * Nudges (translates) the top left corner of a Rectangle by a given offset.
 * @param rect The Rectangle to adjust.
 * @param x The distance to move the Rectangle horizontally.
 * @param y The distance to move the Rectangle vertically.
 */
function Offset<O extends Rectangle>(rect: O, x: number, y: number) {
  rect.x += x;
  rect.y += y;
  return rect;
}

export default Offset;
