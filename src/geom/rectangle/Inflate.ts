import CenterOn from './CenterOn';
import Rectangle from './Rectangle';

/**
 * Increases the size of a Rectangle by a specified amount.
 *
 * The center of the Rectangle stays the same. The amounts are added to each side, so the actual increase in width or height is two times bigger than the respective argument.
 * @param rect The Rectangle to inflate.
 * @param x How many pixels the left and the right side should be moved by horizontally.
 * @param y How many pixels the top and the bottom side should be moved by vertically.
 */
function Inflate<O extends Rectangle>(rect: O, x: number, y: number) {
  const cx = rect.centerX;
  const cy = rect.centerY;

  rect.setSize(rect.width + x * 2, rect.height + y * 2);
  return CenterOn(rect, cx, cy);
}

export default Inflate;
