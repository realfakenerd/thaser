import type Rectangle from './Rectangle';

/**
 * Calculates the area of the given Rectangle object.
 * @param rect The rectangle to calculate the area of.
 */
function Area(rect: Rectangle) {
  return rect.width * rect.height;
}

export default Area;
