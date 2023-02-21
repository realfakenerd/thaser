import { ColorObject } from '@thaser/types/display';

/**
 * Converts the given color value into an Object containing r,g,b and a properties.
 * @param color A color value, optionally including the alpha value.
 */
function ColorToRGBA(color: number): ColorObject {
  const output = {
    r: (color >> 16) & 0xff,
    g: (color >> 8) & 0xff,
    b: color & 0xff,
    a: 255
  };

  if (color > 16777215) output.a = color >>> 24;

  return output;
}
export default ColorToRGBA;
