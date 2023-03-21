import { Vector2 } from '@thaser/math';
import { Point } from '../point';
import Rectangle from './Rectangle';

/**
 * Nudges (translates) the top-left corner of a Rectangle by the coordinates of a point (translation vector).
 * @param rect The Rectangle to adjust.
 * @param point The point whose coordinates should be used as an offset.
 */
function OffsetPoint<O extends Rectangle>(rect: O, point: Point | Vector2) {
  rect.x += point.x;
  rect.y += point.y;

  return rect;
}
export default OffsetPoint;
