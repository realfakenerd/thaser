/**
 * Finds the key within the top level of the {@link source} object, or returns {@link defaultValue}
 * @param source The object to search
 * @param key The key for the property on source. Must exist at the top level of the source object (no periods)
 * @param defaultValue The default value to use if the key does not exist.
 */
function GetFastValue<T extends Record<string, any>>(
  source: T,
  key: string,
  defaultValue?: any
) {
  const t = typeof source;
  if (!source || t === 'number' || t === 'string') return defaultValue!;
  else if (source.hasOwnProperty(key) && source[key] !== undefined)
    return source[key];
  else return defaultValue!;
}
export default GetFastValue;
