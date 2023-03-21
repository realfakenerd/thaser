import { Point } from '../point';
import Rectangle from './Rectangle';

/**
 * Returns the center of a Rectangle as a Point.
 * @param rect The Rectangle to get the center of.
 * @param out Optional point-like object to update with the center coordinates.
 */
function GetCenter<O extends Point>(rect: Rectangle, out = new Point() as O) {
  out.x = rect.centerX;
  out.y = rect.centerY;

  return out;
}

export default GetCenter;
