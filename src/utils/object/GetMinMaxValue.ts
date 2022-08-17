import { Clamp } from '../../math';
import GetValue from './GetValue';

/**
 * Retrieves and clamps a numerical value from an object.
 * @param source The object to retrieve the value from.
 * @param key The name of the property to retrieve from the object. If a property is nested, the names of its preceding properties should be separated by a dot (`.`).
 * @param min The minimum value which can be returned.
 * @param max The maximum value which can be returned.
 * @param defaultValue The value to return if the property doesn't exist. It's also constrained to the given bounds.
 */
function GetMinMaxValue(
  source: Record<any, any>,
  key: string,
  min: number,
  max: number,
  defaultValue: number
): number {
  if (defaultValue === undefined) {
    defaultValue = min;
  }

  const value = GetValue(source, key, defaultValue);
  return Clamp(value, min, max);
}
export default GetMinMaxValue;
