import { Between } from '@thaser/math';
import { Point } from '../point';
import ContainsRect from './ContainsRect';
import Rectangle from './Rectangle';

/**
 * Calculates a random point that lies within the `outer` Rectangle, but outside of the `inner` Rectangle.
 * The inner Rectangle must be fully contained within the outer rectangle.
 * @param outer The outer Rectangle to get the random point within.
 * @param inner The inner Rectangle to exclude from the returned point.
 * @param out A Point, or Point-like object to store the result in. If not specified, a new Point will be created.
 */
function RandomOutside<O extends Point>(
  outer: Rectangle,
  inner: Rectangle,
  out = new Point() as O
) {
  if (ContainsRect(outer, inner)) {
    switch (Between(0, 3)) {
      case 0:
        out.x = outer.x + Math.random() * (inner.right - outer.x);
        out.y = outer.y + Math.random() * (inner.top - outer.y);
        break;

      case 1:
        out.x = inner.x + Math.random() * (outer.right - inner.x);
        out.y = inner.bottom + Math.random() * (outer.bottom - inner.bottom);
        break;

      case 2:
        out.x = outer.x + Math.random() * (inner.x - outer.x);
        out.y = inner.y + Math.random() * (outer.bottom - inner.y);
        break;

      case 3:
        out.x = inner.right + Math.random() * (outer.right - inner.right);
        out.y = outer.y + Math.random() * (inner.bottom - outer.y);
        break;
    }
  }

  return out;
}

export default RandomOutside;
