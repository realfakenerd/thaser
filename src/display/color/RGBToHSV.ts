import { HSVColorObject } from '@thaser/types/display';
import Color from './Color';

/**
 * Converts an RGB color value to HSV (hue, saturation and value).
 * Conversion formula from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes RGB values are contained in the set [0, 255] and returns h, s and v in the set [0, 1].
 * Based on code by Michael Jackson (https://github.com/mjijackson)
 * @param r The red color value. A number between 0 and 255.
 * @param g The green color value. A number between 0 and 255.
 * @param b The blue color value. A number between 0 and 255.
 * @param out An object to store the color values in. If not given an HSV Color Object will be created.
 */
function RGBToHSV(
  r: number,
  g: number,
  b: number,
  out: HSVColorObject | Color = { h: 0, s: 0, v: 0 }
): HSVColorObject | Color {
  r /= 255;
  g /= 255;
  b /= 255;

  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const d = max - min;

  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else if (max === b) h = (r - g) / d + 4;

    h /= 6;
  }

  if(out.hasOwnProperty('_h')) {
    (out as Color)._h = h;
    (out as Color)._s = s;
    (out as Color)._v = v;
  } else {
    out.h = h;
    out.s = s;
    out.v = v;
  }

  return out;
}

export default RGBToHSV;
