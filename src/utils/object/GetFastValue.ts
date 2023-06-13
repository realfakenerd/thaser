/**
 * Finds the key within the top level of the {@link source} object, or returns {@link defaultValue}
 * @param source The object to search
 * @param key The key for the property on source. Must exist at the top level of the source object (no periods)
 * @param defaultValue The default value to use if the key does not exist.
 */
function GetFastValue<T, K extends keyof T, P>(
  source: T,
  key: K,
  defaultValue?: P | undefined
) {
  if (source === null || typeof source !== 'object') {
    return defaultValue!;
  }

  const value = source[key];
  return value !== undefined ? value : defaultValue!;
}
export default GetFastValue;
