import HasValue from './HastValue';

/**
 * Returns a new object that only contains the `keys` that were found on the object provided.
 * If no `keys` are found, an empty object is returned.
 * @param object The object to pick the provided keys from.
 * @param keys An array of properties to retrieve from the provided object.
 *
 * @return A new object that only contains the `keys` that were found on the provided object. If no `keys` were found, an empty object will be returned.
 */
function Pick(object: Record<any,any>, keys: any[]) {
  const obj: Record<any,any> = {};
  let i = 0;
  for (i; i < keys.length; i++) {
    const key = keys[i];
    if (HasValue(object, key)) {
      obj[key] = object[key];
    }
  }

  return obj;
}
export default Pick;
