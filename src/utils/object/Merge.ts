import Clone from './Clone';

/**
 * Creates a new Object using all values from obj1 and obj2.
 * If a value exists in both obj1 and obj2, the value in obj1 is used.
 *
 * This is only a shallow copy. Deeply nested objects are not cloned, so be sure to only use this
 * function on shallow objects.
 * @param obj1 The first object.
 * @param obj2 The second object.
 * 
 * @return A new object containing the union of obj1's and obj2's properties.
 */
function Merge(
  obj1: Record<any, any>,
  obj2: Record<any, any>
): Record<any, any> {
  const clone = Clone(obj1);
  for (const key in obj2) {
    if (!clone.hasOwnProperty(key)) {
      clone[key] = obj2[key];
    }
  }
  return clone;
}

export default Merge;
