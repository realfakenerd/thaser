/**
 * Verifies that an object contains at least one of the requested keys
 * @param source an object on which to check for key existence
 * @param keys an array of keys to search the object for.
 * 
 * @return `true` if the source object contains at least one of the keys, `false` otherwise.
 */
function HasAny(source: object, keys: string[]): boolean {
  let i = 0;
  for (i; i < keys.length; i++) {
    if (source.hasOwnProperty(keys[i])) {
      return true;
    }
  }

  return false;
}
export default HasAny;