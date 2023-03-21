import type Rectangle from './Rectangle';

/**
 * Rounds a Rectangle's position and size up to the smallest integer greater than or equal to each respective value.
 * @param rect The Rectangle to modify.
 */
function CeilAll<O extends Rectangle>(rect: O) {
  rect.x = Math.ceil(rect.x);
  rect.y = Math.ceil(rect.y);
  rect.width = Math.ceil(rect.width);
  rect.height = Math.ceil(rect.height);
  return rect;
}

export default CeilAll;
