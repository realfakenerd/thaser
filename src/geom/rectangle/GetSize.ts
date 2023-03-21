import { Point } from '../point';
import Rectangle from './Rectangle';

/**
 * Returns the size of the Rectangle, expressed as a Point object.
 * With the value of the `width` as the `x` property and the `height` as the `y` property.
 * @param rect The Rectangle to get the size from.
 * @param out The Point object to store the size in. If not given, a new Point instance is created.
 */
function GetSize<O extends Point>(rect: Rectangle, out = new Point() as O) {
  out.x = rect.width;
  out.y = rect.height;
  return out;
}

export default GetSize;
