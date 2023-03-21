import { DegToRad } from '@thaser/math';
import { Point } from '../point';
import Rectangle from './Rectangle';

/**
 * Returns a Point from the perimeter of a Rectangle based on the given angle.
 * @param rectangle The Rectangle to get the perimeter point from.
 * @param angle The angle of the point, in degrees.
 * @param out The Point object to store the position in. If not given, a new Point instance is created.
 */
function PerimeterPoint<O extends Point>(
  rectangle: Rectangle,
  angle: number,
  out = new Point() as O
) {
  angle = DegToRad(angle);

  const s = Math.sin(angle);
  const c = Math.cos(angle);

  let dx = c > 0 ? rectangle.width / 2 : rectangle.width / -2;
  let dy = s > 0 ? rectangle.height / 2 : rectangle.height / -2;

  if (Math.abs(dx * s) < Math.abs(dy * c)) dx = dx * c;
  else dy = dy * s;

  out.x = dx + rectangle.centerX;
  out.y = dy + rectangle.centerY;

  return out;
}

export default PerimeterPoint;
