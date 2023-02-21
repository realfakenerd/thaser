import { ColorObject } from '@thaser/types/display';
import GetColor from './GetColor';

/**
 * Return an array of Colors in a Color Spectrum.
 *
 * The spectrum colors flow in the order: red, yellow, green, blue.
 *
 * By default this function will return an array with 1024 elements in.
 *
 * However, you can reduce this to a smaller quantity if needed, by specitying the `limit` parameter.
 * @param limit How many colors should be returned? The maximum is 1024 but you can set a smaller quantity if required. Default 1024.
 */
function ColorSpectrum(limit = 1024): ColorObject[] {
  const colors: ColorObject[] = [];
  const range = 255;

  let i: number;
  let r = 255;
  let g = 0;
  let b = 0;

  for (i = 0; i <= range; i++) {
    colors.push({ r, g: i, b, color: GetColor(r, i, b) });
  }

  g = 255;

  for (i = range; i >= 0; i--) {
    colors.push({ r: i, g, b, color: GetColor(i, g, b) });
  }

  r = 0;

  for (i = 0; i <= range; i++, g--) {
    colors.push({ r, g, b: i, color: GetColor(r, g, i) });
  }
  g = 0;
  b = 255;

  for (i = 0; i <= range; i++, b--, r++) {
    colors.push({ r, g, b, color: GetColor(r, g, b) });
  }

  if (limit === 1024) {
    return colors;
  } else {
    const out = [];
    let t = 0;
    const inc = 1024 / limit;
    for (i = 0; i < limit; i++) {
      out.push(colors[Math.floor(t)]);
      t += inc;
    }
    return out;
  }
}
export default ColorSpectrum;
