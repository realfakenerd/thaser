import { Between } from '@thaser/math';
import Color from './Color';

/**
 * Creates a new Color object where the r, g, and b values have been set to random values
 * based on the given min max values.
 * @param min The minimum value to set the random range from (between 0 and 255) Default 0.
 * @param max The maximum value to set the random range from (between 0 and 255) Default 255.
 */
function RandomRGB(min = 0, max = 255): Color {
  return new Color(Between(min, max), Between(min, max), Between(min, max));
}
export default RandomRGB;
