import { Point } from '../point';
import Perimiter from './Perimiter';
import type Rectangle from './Rectangle';

/**
 * Calculates the coordinates of a point at a certain `position` on the Rectangle's perimeter.
 *
 * The `position` is a fraction between 0 and 1 which defines how far into the perimeter the point is.
 *
 * A value of 0 or 1 returns the point at the top left corner of the rectangle, while a value of 0.5 returns the point at the bottom right corner of the rectangle. Values between 0 and 0.5 are on the top or the right side and values between 0.5 and 1 are on the bottom or the left side.
 * @param rectangle The Rectangle to get the perimeter point from.
 * @param position The normalized distance into the Rectangle's perimeter to return.
 * @param out An object to update with the `x` and `y` coordinates of the point.
 */
function GetPoint<O extends Point>(
  rectangle: Rectangle,
  position: number,
  out = new Point() as O
): O {
  if (position <= 0 || position >= 1) {
    out.x = rectangle.x;
    out.y = rectangle.y;
    return out;
  }

  let p = Perimiter(rectangle) * position;

  if (position > 0.5) {
    p -= rectangle.width + rectangle.height;
    if (p <= rectangle.width) {
      out.x = rectangle.right - p;
      out.y = rectangle.bottom;
    } else {
      out.x = rectangle.x;
      out.y = rectangle.bottom - (p - rectangle.width);
    }
  } else if (p <= rectangle.width) {
    out.x = rectangle.x + p;
    out.y = rectangle.y;
  } else {
    out.x = rectangle.right;
    out.y = rectangle.y - (p - rectangle.width);
  }

  return out;
}

export default GetPoint;
