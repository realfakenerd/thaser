import { ColorObject } from '@thaser/types/display';
import HSVToRGB from './HSVToRGB';

/**
 * Generates an HSV color wheel which is an array of 360 Color objects, for each step of the wheel.
 * @param s The saturation, in the range 0 - 1. Default 1.
 * @param v The value, in the range 0 - 1. Default 1.
 */
function HSVColorWheel(s = 1, v = 1): ColorObject[] {
  const colors: ColorObject[] = [];
  let c = 0;
  for (c; c <= 359; c++) colors.push(HSVToRGB(c / 359, s, v) as ColorObject);

  return colors;
}
export default HSVColorWheel;
