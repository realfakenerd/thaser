import { ColorObject } from '@thaser/types/display';
import Color from './Color';
import GetColor from './GetColor';

function ConvertValue(n: number, h: number, s: number, v: number) {
  const k = (n + h * 6) % 6;
  const min = Math.min(k, 4 - k, 1);
  return Math.round(255 * (v - v * s * Math.max(0, min)));
}

/**
 * Converts a HSV (hue, saturation and value) color set to RGB.
 *
 * Conversion formula from https://en.wikipedia.org/wiki/HSL_and_HSV
 *
 * Assumes HSV values are contained in the set [0, 1].
 * @param h The hue, in the range 0 - 1. This is the base color.
 * @param s The saturation, in the range 0 - 1. This controls how much of the hue will be in the final color, where 1 is fully saturated and 0 will give you white.
 * @param v The value, in the range 0 - 1. This controls how dark the color is. Where 1 is as bright as possible and 0 is black.
 * @param out A Color object to store the results in. If not given a new ColorObject will be created.
 */
function HSVToRGB(h: number, s = 1, v = 1, out?: Color | ColorObject): Color | ColorObject {
  const r = ConvertValue(5, h, s, v);
  const g = ConvertValue(3, h, s, v);
  const b = ConvertValue(1, h, s, v);

  if (!out) return { r, g, b, color: GetColor(r, g, b) };
  else if ((out as Color).setTo) return (out as Color).setTo(r,g,b,(out as Color).alpha, false);
  else {
    (out as ColorObject).r = r;
    (out as ColorObject).g = g;
    (out as ColorObject).b = b;
    (out as ColorObject).color = GetColor(r, g, b);
    return out;
  }
}

export default HSVToRGB;
