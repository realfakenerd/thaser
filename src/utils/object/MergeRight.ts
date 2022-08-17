import Clone from './Clone';

/**
 * Creates a new Object using all values from obj1.
 *
 * Then scans obj2. If a property is found in obj2 that *also* exists in obj1, the value from obj2 is used, otherwise the property is skipped.
 * @param obj1 The first object to merge.
 * @param obj2 The second object to merge. Keys from this object which also exist in `obj1` will be copied to `obj1`.
 */
function MergeRight(
  obj1: Record<any, any>,
  obj2: Record<any, any>
): Record<any, any> {
  const clone = Clone(obj1);
  for (const key in obj2) {
    if (clone.hasOwnProperty(key)) {
      clone[key] = obj2[key];
    }
  }
  return clone;
}

export default MergeRight;