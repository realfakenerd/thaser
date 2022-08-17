/**
 * Sets a value in an object, allowing for dot notation to control the depth of the property.
 *
 * For example:
 *
 * ```javascript
 * var data = {
 *   world: {
 *     position: {
 *       x: 200,
 *       y: 100
 *     }
 *   }
 * };
 *
 * SetValue(data, 'world.position.y', 300);
 *
 * console.log(data.world.position.y); // 300
 * ```
 * @param source The object to set the value in.
 * @param key The name of the property in the object. If a property is nested, the names of its preceding properties should be separated by a dot (`.`)
 * @param value The value to set into the property, if found in the source object.
 *
 * @return `true` if the property key was valid and the value was set, otherwise `false`.
 */
function SetValue(source: Record<any, any>, key: string, value: any): boolean {
  if (!source || typeof source === 'number') return false;
  else if (source.hasOwnProperty(key)) {
    source[key] = value;
    return true;
  } else if (key.indexOf('.') !== -1) {
    const keys = key.split('.');
    let parent = source;
    let prev = source;

    let i = 0;
    for (i; i < keys.length; i++) {
      if (parent.hasOwnProperty(keys[i])) {
        prev = parent;
        parent = parent[keys[i]];
      } else return false;
    }

    prev[keys[keys.length - 1]] = value;

    return true;
  }

  return false;
}
export default SetValue;
