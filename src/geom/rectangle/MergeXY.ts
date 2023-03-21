import Rectangle from './Rectangle';

/**
 * Merges a Rectangle with a point by repositioning and/or resizing it so that the point is on or within its bounds.
 * @param target The Rectangle which should be merged and modified.
 * @param x The X coordinate of the point which should be merged.
 * @param y The Y coordinate of the point which should be merged.
 */
function MergeXY<O extends Rectangle>(target: O, x: number, y: number) {
  const minX = Math.min(target.x, x);
  const maxX = Math.max(target.right, x);

  target.x = minX;
  target.width = maxX - minX;

  const minY = Math.min(target.y, y);
  const maxY = Math.max(target.bottom, y);

  target.y = minY;
  target.height = maxY - minY;

  return target;
}

export default MergeXY;
