import Rectangle from './Rectangle';

/**
 * Scales the width and height of this Rectangle by the given amounts.
 * @param rect The `Rectangle` object that will be scaled by the specified amount(s).
 * @param x The factor by which to scale the rectangle horizontally.
 * @param y The amount by which to scale the rectangle vertically. If this is not specified, the rectangle will be scaled by the factor `x` in both directions.
 */
function Scale<O extends Rectangle>(rect: O, x: number, y = x) {
  rect.width *= x;
  rect.height *= y;

  return rect;
}
export default Scale;
