import { InputColorObject } from '@thaser/types/display';
import Color from './Color';

/**
 * Converts an object containing `r`, `g`, `b` and `a` properties into a Color class instance.
 * @param input An object containing `r`, `g`, `b` and `a` properties in the range 0 to 255.
 */
function ObjectToColor(input: InputColorObject): Color {
  return new Color(input.r, input.g, input.b, input.a);
}
export default ObjectToColor;
