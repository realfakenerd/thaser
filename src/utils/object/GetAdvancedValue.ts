import GetValue from './GetValue';
import { RND } from '../../math';
/**
 * Retrieves a value from an object. Allows for more advanced selection options, including:
 *
 * Allowed types:
 *
 * Implicit
 * {
 *     x: 4
 * }
 *
 * From function
 * {
 *     x: function ()
 * }
 *
 * Randomly pick one element from the array
 * {
 *     x: [a, b, c, d, e, f]
 * }
 *
 * Random integer between min and max:
 * {
 *     x: { randInt: [min, max] }
 * }
 *
 * Random float between min and max:
 * {
 *     x: { randFloat: [min, max] }
 * }
 * @param source The object to retrieve the value from.
 * @param key The name of the property to retrieve from the object. If a property is nested, the names of its preceding properties should be separated by a dot (`.`) - `banner.hideBanner` would return the value of the `hideBanner` property from the object stored in the `banner` property of the `source` object.
 * @param defaultValue The value to return if the `key` isn't found in the `source` object.
 *
 * @return The value of the requested key;
 */
function GetAdvancedValue(source: object, key: string, defaultValue: any): any {
  const value = GetValue(source, key, null);

  if (value === null) return defaultValue;
  else if (Array.isArray(value)) return new RND().pick(value);
  else if (typeof value === 'object') {
    if (value.hasOwnProperty('radInt'))
      return new RND().integerInRange(value.randInt[0], value.randInt[1]);
    else if (value.hasOwnProperty('randFloat'))
      return new RND().realInRange(value.randFloat[0], value.randFloat[1]);
  } else if (typeof value === 'function') value(key);
  return value;
}

export default GetAdvancedValue;
