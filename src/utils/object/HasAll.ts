/**
 * Verifies that an object contains all requested keys
 * @param source an object on which to check for key existence
 * @param keys an array of keys to ensure the source object contains
 * 
 * @rertun `true` if the source object contains all keys, `false` otherwise.
 */
function HasAll(source: object, keys: string[]): boolean {
  let i = 0;
  for (i; i < keys.length; i++) {
    if (!source.hasOwnProperty(keys[i])) {
      return false;
    }
  }

  return true;
}
export default HasAll;