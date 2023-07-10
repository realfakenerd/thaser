/**
 * Deep Copy the given object or array.
 * @param inObject The object to deep copy.
 *
 * @return A deep copy of the original object.
 */
function DeepCopy<const T>(inObject: T):T {
  if (typeof inObject !== 'object' || inObject === null) return inObject;

  let outObject: any;

  if (Array.isArray(inObject)) {
    outObject = inObject.map(value => DeepCopy(value));
  } else {
    outObject = {} as T;
    for (let key in inObject) {
      if (inObject.hasOwnProperty(key)) {
        outObject[key] = DeepCopy(inObject[key]);
      }
    }
  }

  return outObject;
}
export default DeepCopy;
