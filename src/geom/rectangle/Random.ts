import { Point } from '../point';
import Rectangle from './Rectangle';

/**
 * Returns a random point within a Rectangle.
 * @param rect The Rectangle to return a point from.
 * @param out The object to update with the point's coordinates.
 */
function Random<O extends Point>(rect: Rectangle, out = new Point() as O) {
  out.x = rect.x + rect.width * Math.random();
  out.y = rect.y + rect.height * Math.random();
  return out;
}

export default Random;
