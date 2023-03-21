import Rectangle from './Rectangle';
import { CONST as MATH_CONST } from '@thaser/math';
//  points is an array of Point-like objects,
//  either 2 dimensional arrays, or objects with public x/y properties:
//  var points = [
//      [100, 200],
//      [200, 400],
//      { x: 30, y: 60 }
//  ]

/**
 * Constructs new Rectangle or repositions and resizes an existing Rectangle so that all of the given points are on or within its bounds.
 * @param points An array of points (either arrays with two elements corresponding to the X and Y coordinate or an object with public `x` and `y` properties) which should be surrounded by the Rectangle.
 * @param out Optional Rectangle to adjust.
 */
function FromPoints<O extends Rectangle>(
  points: any[],
  out = new Rectangle() as O
) {
  if (points.length === 0) return out;

  let minX = Number.MAX_VALUE;
  let minY = Number.MAX_VALUE;

  let maxX = MATH_CONST.MIN_SAFE_INTEGER;
  let maxY = MATH_CONST.MIN_SAFE_INTEGER;

  let p: { x: number; y: number };
  let px: number;
  let py: number;

  let i = 0;
  for (i; i < points.length; i++) {
    p = points[i];
    if (Array.isArray(p)) {
      px = p[0];
      py = p[1];
    } else {
      px = p.x;
      py = p.y;
    }

    minX = Math.min(minX, px);
    minY = Math.min(minY, py);

    maxX = Math.max(maxX, px);
    maxY = Math.max(maxY, py);
  }

  out.x = minX;
  out.y = minY;
  out.width = maxX - minX;
  out.height = maxY - minY;
  return out;
}
export default FromPoints;
