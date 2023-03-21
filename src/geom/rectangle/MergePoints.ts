import { Point } from '../point';
import Rectangle from './Rectangle';

/**
 * Merges a Rectangle with a list of points by repositioning and/or resizing it such that all points are located on or within its bounds.
 * @param target The Rectangle which should be merged.
 * @param points An array of Points (or any object with public `x` and `y` properties) which should be merged with the Rectangle.
 */
function MergePoints<O extends Rectangle>(target: O, points: Point[]) {
  let minX = target.x;
  let maxX = target.right;
  let minY = target.y;
  let maxY = target.bottom;

  let i = 0;
  for (i; i < points.length; i++) {
    minX = Math.min(minX, points[i].x);
    maxX = Math.max(maxX, points[i].x);
    minY = Math.min(minY, points[i].y);
    maxY = Math.max(maxY, points[i].y);
  }

  target.x = minX;
  target.y = minY;
  target.width = maxX - minX;
  target.height = maxY - minY;

  return target;
}

export default MergePoints;
