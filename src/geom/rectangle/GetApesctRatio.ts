import type Rectangle from './Rectangle';

/**
 * Calculates the width/height ratio of a rectangle.
 * @param rect The rectangle.
 */
function GetAspectRatio(rect: Rectangle) {
  return rect.height === 0 ? NaN : rect.width / rect.height;
}
export default GetAspectRatio;