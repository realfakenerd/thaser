import Rectangle from './Rectangle';

/**
 * Merges the source rectangle into the target rectangle and returns the target.
 * Neither rectangle should have a negative width or height.
 * @param target Target rectangle. Will be modified to include source rectangle.
 * @param source Rectangle that will be merged into target rectangle.
 */
function MergeRect<O extends Rectangle>(target: O, source: Rectangle) {
  const minX = Math.min(target.x, source.x);
  const maxX = Math.max(target.right, source.right);

  target.x = minX;
  target.width = maxX - minX;

  const minY = Math.min(target.y, source.y);
  const maxY = Math.max(target.bottom, source.bottom);

  target.y = minY;
  target.height = maxY - minY;

  return target;
}

export default MergeRect;
