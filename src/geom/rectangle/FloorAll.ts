import Rectangle from './Rectangle';

/**
 * Rounds a Rectangle's position and size down to the largest integer less than or equal to each current coordinate or dimension.
 * @param rect The Rectangle to adjust.
 */
function FloorAll<O extends Rectangle>(rect: O) {
  rect.x = Math.floor(rect.x);
  rect.y = Math.floor(rect.y);
  rect.width = Math.floor(rect.width);
  rect.height = Math.floor(rect.height);
  return rect;
}
export default FloorAll;
