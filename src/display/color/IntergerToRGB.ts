import { ColorObject } from '@thaser/types/display';

/**
 * Return the component parts of a color as an Object with the properties alpha, red, green, blue.
 *
 * Alpha will only be set if it exists in the given color (0xAARRGGBB)
 * @param color The color value to convert into a Color object.
 */
function IntegerToRGB(color: number): ColorObject {
  if (color > 16777215)
    return {
      a: color >> 24,
      r: (color >> 16) & 0xff,
      g: (color >> 8) & 0xff,
      b: color & 0xff
    };
  else
    return {
      a: 255,
      r: (color >> 16) & 0xff,
      g: (color >> 8) & 0xff,
      b: color & 0xff
    };
}

export default IntegerToRGB;
