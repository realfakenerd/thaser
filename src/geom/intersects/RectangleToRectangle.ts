import { Rectangle } from '../rectangle';

/**
 * Checks if two Rectangles intersect.
 *
 * A Rectangle intersects another Rectangle if any part of its bounds is within the other Rectangle's bounds.
 * As such, the two Rectangles are considered "solid".
 * A Rectangle with no width or no height will never intersect another Rectangle.
 * @param rectA The first Rectangle to check for intersection.
 * @param rectB The second Rectangle to check for intersection.
 */
function RectangleToRectangle(rectA: Rectangle, rectB: Rectangle) {
  if (
    rectA.width <= 0 ||
    rectA.height <= 0 ||
    rectB.width <= 0 ||
    rectB.height <= 0
  )
    return false;

  return !(
    rectA.right < rectB.x ||
    rectA.bottom < rectB.y ||
    rectA.x > rectB.right ||
    rectA.y > rectB.bottom
  );
}

export default RectangleToRectangle;
