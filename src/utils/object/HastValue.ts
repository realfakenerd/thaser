/**
 * Determine whether the source object has a property with the specified key.
 * @param source The source object to be checked.
 * @param key The property to check for within the object
 *
 * @return `true` if the provided `key` exists on the `source` object, otherwise `false`.
 */
function HasValue(source: object, key: string): boolean {
  return source.hasOwnProperty(key);
}
export default HasValue;
