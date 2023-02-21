import { InputColorObject } from '@thaser/types/display';
import HexStringToColor from './HexStringToColor';
import IntegerToColor from './IntegerToColor';
import ObjectToColor from './ObjectToColor';
import RGBStringToColor from './RGBStringToColor';

/**
 * Converts the given source color value into an instance of a Color class.
 * The value can be either a string, prefixed with `rgb` or a hex string, a number or an Object.
 * @param input The source color value to convert.
 */
function ValueToColor(input: string | number | InputColorObject) {
  const t = typeof input;

  switch (t) {
    case 'string':
      if ((input as string).substr(0, 3).toLowerCase() === 'rgb')
        return RGBStringToColor(input as string);
      else HexStringToColor(input as string);
    case 'number':
      return IntegerToColor(input as number);
    case 'object':
      return ObjectToColor(input as InputColorObject);
  }
}
export default ValueToColor;
