import { Point } from '../point';
import Perimeter from './Perimiter';
import Rectangle from './Rectangle';

/**
 * Returns an array of points from the perimeter of the Rectangle, where each point is spaced out based
 * on either the `step` value, or the `quantity`.
 * @param rect The Rectangle to get the perimeter points from.
 * @param step The distance between each point of the perimeter. Set to `null` if you wish to use the `quantity` parameter instead.
 * @param quantity The total number of points to return. The step is then calculated based on the length of the Rectangle, divided by this value.
 * @param out An array in which the perimeter points will be stored. If not given, a new array instance is created.
 */
function MarchingAnts<O extends Point[]>(
  rect: Rectangle,
  step?: number,
  quantity?: number,
  //@ts-ignore
  out: O = []
) {
  if (!step && !quantity) return out;

  if (!step) step = Perimeter(rect) / quantity!;
  else quantity = Math.round(Perimeter(rect) / step!);

  let x = rect.x;
  let y = rect.y;
  let face = 0;

  let i = 0;
  for (i; i < quantity!; i++) {
    out.push(new Point(x, y));

    switch (face) {
      case 0:
        x += step!;
        if (x >= rect.right) {
          face = 1;
          y += x - rect.right;
          x = rect.right;
        }
        break;
      case 1:
        y += step!;
        if (y >= rect.bottom) {
          face = 2;
          x -= y - rect.bottom;
          y = rect.bottom;
        }
        break;
      case 2:
        x -= step!;
        if (x <= rect.left) {
          face = 3;
          y -= rect.left - x;
          x = rect.left;
        }
        break;
      case 3:
        y -= step!;
        if (y <= rect.top) {
          face = 0;
          y = rect.top;
        }
        break;
    }
  }

  return out;
}

export default MarchingAnts;
